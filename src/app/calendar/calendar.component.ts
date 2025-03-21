import { Component, LOCALE_ID, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { L10N_PREFIX, LocalizationService } from '@progress/kendo-angular-l10n';
import { CldrIntlService, IntlService } from '@progress/kendo-angular-intl';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CalendarComponent),
      multi: true
    },
    {
      provide: LOCALE_ID,
      useValue: 'vi'
    },
    {
      provide: L10N_PREFIX,
      useValue: 'kendo.calendar'
    },
    {
      provide: IntlService,
      useClass: CldrIntlService
    }
  ]
})
export class CalendarComponent implements OnInit, ControlValueAccessor {
  // Ngày tối thiểu (các ngày trước sẽ bị disable)
  public minDate: Date = new Date();
  // Giá trị cho DatePicker (chỉ ngày)
  public dateOnlyValue: Date = new Date();
  // Giá trị cho DateTimePicker (ngày + giờ)
  public dateTimeValue: Date = new Date();

  // Callback cập nhật giá trị (UI → Model)
  private onChange: (val: Date | null) => void = () => {};
  // Callback đánh dấu đã tương tác với control
  private onTouched: () => void = () => {};

  constructor(
    private intlService: IntlService,
    private localization: LocalizationService
  ) {}

  ngOnInit(): void {
    // Cấu hình locale cho Kendo Intl
    (this.intlService as CldrIntlService).localeId = 'vi';

    // Cấu hình thông báo, button của Calendar
    this.localization.register('calendar.today', '');
    this.localization.register('calendar.navigateToNextView', 'Tháng sau');
    this.localization.register('calendar.navigateToPreviousView', 'Tháng trước');
    this.localization.register('calendar.navigateToParentView', 'Xem tổng quan');
  }

  // Ghi giá trị từ Model vào View
  writeValue(value: Date | null): void {
    if (value) {
      this.dateOnlyValue = value;
    }
  }

  // Đăng ký callback khi UI thay đổi (để cập nhật Model)
  registerOnChange(fn: (val: Date | null) => void): void {
    this.onChange = fn;
  }

  // Đăng ký callback khi người dùng "chạm" vào control
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Cho phép set trạng thái disabled nếu cần
  setDisabledState?(isDisabled: boolean): void {
    // Tùy chỉnh nếu muốn
  }

  // Khi DatePicker (chỉ ngày) thay đổi
  onDateOnlyChange(value: Date): void {
    this.dateOnlyValue = value;
    this.onChange(value);
    this.onTouched();
  }

  // Khi DateTimePicker (ngày + giờ) thay đổi
  onDateTimeChange(value: Date): void {
    this.dateTimeValue = value;
    this.onChange(value);
    this.onTouched();
  }

  // Lắng nghe các sự kiện mở/đóng, focus/blur
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
