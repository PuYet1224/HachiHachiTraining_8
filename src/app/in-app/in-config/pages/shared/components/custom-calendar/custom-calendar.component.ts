import { Component, OnInit, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { L10N_PREFIX } from '@progress/kendo-angular-l10n';
import { IntlService, CldrIntlService } from '@progress/kendo-angular-intl';

@Component({
  selector: 'app-custom-calendar',
  templateUrl: './custom-calendar.component.html',
  styleUrls: ['./custom-calendar.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomCalendarComponent),
      multi: true
    },
    { provide: L10N_PREFIX, useValue: 'kendo.calendar' }
  ]
})
export class CustomCalendarComponent implements OnInit, ControlValueAccessor {
  @ViewChild('timeDropdown') timeDropdown: any;
  minDate = new Date();
  dateOnlyValue = new Date();
  dateTimeValue = new Date();
  allDay = false;
  timeList: Date[] = [];
  displayedTimeList: Date[] = [];
  selectedTime: Date | null = null;
  isAM = true;
  previousTime: Date | null = null;

  private onChange: (val: Date | null) => void = () => {};
  private onTouched: () => void = () => {};

  /**
   * Hàm dựng
   * @param intlService - Dịch vụ nội bộ của Kendo để thiết lập ngôn ngữ/locale
   */
  constructor(private intlService: IntlService) {}

  /**
   * Khi khởi tạo, thiết lập locale="vi" nếu dùng CldrIntlService.
   * Tạo mảng timeList (48 mốc, mỗi mốc cách 30p).
   */
  ngOnInit(): void {
    if (this.intlService instanceof CldrIntlService) {
      (this.intlService as CldrIntlService).localeId = 'vi';
    }
    const base = new Date(0, 0, 1, 0, 0, 0);
    for (let i = 0; i < 48; i++) {
      this.timeList.push(new Date(base.getTime()));
      base.setMinutes(base.getMinutes() + 30);
    }
    this.filterTimeList();
  }

  /**
   * Hàm khoá những ngày trước hôm nay (không cho chọn)
   * @param date Ngày
   * @returns true nếu bị disable, false nếu chọn được
   */
  disabledDates = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  /**
   * Khi người dùng tích/bỏ tích "Cả ngày"
   * - Tích: lưu selectedTime vào previousTime, đặt giờ 00:00, đóng dropdown
   * - Bỏ tích: khôi phục previousTime nếu có, nếu không thì 00:00
   */
  onAllDayChange(): void {
    if (this.allDay) {
      this.previousTime = this.selectedTime;
      if (this.timeDropdown) {
        this.timeDropdown.toggle(false);
      }
      const d = this.dateTimeValue;
      this.dateTimeValue = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
      this.selectedTime = null;
    } else {
      if (this.previousTime) {
        this.selectedTime = this.previousTime;
        this.combineDateAndTime(this.previousTime);
      } else {
        const d = this.dateTimeValue;
        const fallbackTime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
        this.selectedTime = fallbackTime;
        this.combineDateAndTime(fallbackTime);
      }
    }
    this.onChange(this.dateTimeValue);
    this.onTouched();
  }

  /**
   * Chuyển sang chế độ AM và lọc danh sách giờ
   */
  setAM(): void {
    this.isAM = true;
    this.filterTimeList();
  }

  /**
   * Chuyển sang chế độ PM và lọc danh sách giờ
   */
  setPM(): void {
    this.isAM = false;
    this.filterTimeList();
  }

  /**
   * Lọc danh sách timeList thành displayedTimeList theo AM/PM
   * Nếu selectedTime không thuộc dải mới thì reset
   */
  private filterTimeList(): void {
    this.displayedTimeList = this.isAM
      ? this.timeList.filter(t => t.getHours() < 12)
      : this.timeList.filter(t => t.getHours() >= 12);

    if (
      this.selectedTime &&
      ((this.isAM && this.selectedTime.getHours() >= 12) ||
        (!this.isAM && this.selectedTime.getHours() < 12))
    ) {
      this.selectedTime = null;
    }
    if (!this.selectedTime && this.displayedTimeList.length) {
      this.selectedTime = this.displayedTimeList[0];
      this.combineDateAndTime(this.selectedTime);
    }
  }

  /**
   * Lắng nghe sự kiện valueChange của kendo-dropdownlist
   * Gán selectedTime = value, rồi gộp với dateTimeValue
   */
  onTimeDropdownChange(value: Date): void {
    this.selectedTime = value;
    this.combineDateAndTime(value);
  }

  /**
   * Gộp giờ (time) với ngày cũ (dateTimeValue) => tạo dateTimeValue mới
   */
  private combineDateAndTime(time: Date): void {
    const old = this.dateTimeValue || new Date();
    this.dateTimeValue = new Date(
      old.getFullYear(),
      old.getMonth(),
      old.getDate(),
      time.getHours(),
      time.getMinutes(),
      0
    );
    this.onChange(this.dateTimeValue);
    this.onTouched();
  }

  /**
   * Khi DatePicker thứ 2 thay đổi ngày
   * Giữ nguyên giờ/phút cũ, chỉ thay day/month/year
   */
  onDateTimeChange(date: Date): void {
    const oldH = this.dateTimeValue.getHours();
    const oldM = this.dateTimeValue.getMinutes();
    this.dateTimeValue = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      oldH,
      oldM,
      0
    );
    this.onChange(this.dateTimeValue);
    this.onTouched();
  }

  /**
   * Gán giá trị từ ngoài vào (ControlValueAccessor)
   * Xác định AM/PM => lọc => tìm selectedTime khớp
   */
  writeValue(value: Date | null): void {
    if (value) {
      this.dateTimeValue = value;
      this.isAM = value.getHours() < 12;
      this.filterTimeList();
      const found = this.displayedTimeList.find(
        t => t.getHours() === value.getHours() && t.getMinutes() === value.getMinutes()
      );
      this.selectedTime = found || null;
    }
  }

  /**
   * Lưu callback onchange cho form (ControlValueAccessor)
   */
  registerOnChange(fn: (val: Date | null) => void): void {
    this.onChange = fn;
  }

  /**
   * Lưu callback ontouched cho form (ControlValueAccessor)
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Khi form muốn disable component
   */
  setDisabledState?(isDisabled: boolean): void {}

  /**
   * Log khi DatePicker2 thay đổi, mở/đóng/blur/focus ...
   */
  onOpen(source: string): void {
    console.log(`${source} opened`);
  }
  onClose(source: string): void {
    console.log(`${source} closed`);
  }
  onFocus(source: string): void {
    console.log(`${source} focused`);
  }
  onBlur(source: string): void {
    console.log(`${source} blurred`);
  }
}
