import { Component, EventEmitter, Output, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiServiceService } from 'src/app/services/api-service.service';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-edit-manual-rate',
  templateUrl: './edit-manual-rate.component.html',
  styleUrls: ['./edit-manual-rate.component.scss']
})
export class EditManualRateComponent implements OnInit, OnChanges {
  @Input() formData!: any;
  @Input() isEditVisible = false;
  @Output() visibilityChange = new EventEmitter<boolean>();


  isEditParamData!: FormGroup;
  equipmentsList: any = [];
  isEditData: any = {}


  companyList: any = []
  sourceList: any = []
  destinationList: any = []
  filteredCompanies: any[] = [];
  isCompanyMatched: boolean = false;
  // selectedFile: File | null = null;
  showDropdown: boolean = false;
  filteredSources: any[] = [];
  showSourceDropdown: boolean = false;

  filteredDestination: any[] = [];
  showDestinationDropdown: boolean = false;
  isDirectShipment: boolean = false;
  updatingIdx: any = ''
  rateType: string = 'spot';

  sourceDestinationVia: any[] = []
  // hazType: boolean = false;

  hazActiveStatus: boolean = false;
  showCurrencyDropdown: boolean = false;
  filteredCurrencies: any[] = [];
  currencyInputValue: string = '';

  currencyLists = [
    { code: 'USD', name: 'United States Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'AED', name: 'United Arab Emirates Dirham' },
    { code: 'AFN', name: 'Afghan Afghani' },
    { code: 'ALL', name: 'Albanian Lek' },
    { code: 'AMD', name: 'Armenian Dram' },
    { code: 'ANG', name: 'Netherlands Antillean Guilder' },
    { code: 'AOA', name: 'Angolan Kwanza' },
    { code: 'ARS', name: 'Argentine Peso' },
    { code: 'AWG', name: 'Aruban Florin' },
    { code: 'AZN', name: 'Azerbaijani Manat' },
    { code: 'BAM', name: 'Bosnia - Herzegovina Convertible Mark' },
    { code: 'BBD', name: 'Barbadian Dollar' },
    { code: 'BDT', name: 'Bangladeshi Taka' },
    { code: 'BGN', name: 'Bulgarian Lev' },
    { code: 'BHD', name: 'Bahraini Dinar' },
    { code: 'BIF', name: 'Burundian Franc' },
    { code: 'BMD', name: 'Bermudian Dollar' },
    { code: 'BND', name: 'Brunei Dollar' },
    { code: 'BOB', name: 'Bolivian Boliviano' },
    { code: 'BRL', name: 'Brazilian Real' },
    { code: 'BSD', name: 'Bahamian Dollar' },
    { code: 'BTN', name: 'Bhutanese Ngultrum' },
    { code: 'BWP', name: 'Botswanan Pula' },
    { code: 'BYN', name: 'Belarusian Ruble' },
    { code: 'BZD', name: 'Belize Dollar' },
    { code: 'CDF', name: 'Congolese Franc' },
    { code: 'CHF', name: 'Swiss Franc' },
    { code: 'CLP', name: 'Chilean Peso' },
    { code: 'COP', name: 'Colombian Peso' },
    { code: 'CRC', name: 'Costa Rican Colón' },
    { code: 'CUP', name: 'Cuban Peso' },
    { code: 'CZK', name: 'Czech Koruna' },
    { code: 'DJF', name: 'Djiboutian Franc' },
    { code: 'DKK', name: 'Danish Krone' },
    { code: 'DOP', name: 'Dominican Peso' },
    { code: 'DZD', name: 'Algerian Dinar' },
    { code: 'EGP', name: 'Egyptian Pound' },
    { code: 'ERN', name: 'Eritrean Nakfa' },
    { code: 'ETB', name: 'Ethiopian Birr' },
    { code: 'FJD', name: 'Fijian Dollar' },
    { code: 'FKP', name: 'Falkland Islands Pound' },
    { code: 'GEL', name: 'Georgian Lari' },
    { code: 'GHS', name: 'Ghanaian Cedi' },
    { code: 'GIP', name: 'Gibraltar Pound' },
    { code: 'GMD', name: 'Gambian Dalasi' },
    { code: 'GNF', name: 'Guinean Franc' },
    { code: 'GTQ', name: 'Guatemalan Quetzal' },
    { code: 'GYD', name: 'Guyanese Dollar' },
    { code: 'HKD', name: 'Hong Kong Dollar' },
    { code: 'HNL', name: 'Honduran Lempira' },
    { code: 'HRK', name: 'Croatian Kuna' },
    { code: 'HTG', name: 'Haitian Gourde' },
    { code: 'HUF', name: 'Hungarian Forint' },
    { code: 'IDR', name: 'Indonesian Rupiah' },
    { code: 'ILS', name: 'Israeli New Shekel' },
    { code: 'IQD', name: 'Iraqi Dinar' },
    { code: 'IRR', name: 'Iranian Rial' },
    { code: 'ISK', name: 'Icelandic Króna' },
    { code: 'JMD', name: 'Jamaican Dollar' },
    { code: 'JOD', name: 'Jordanian Dinar' },
    { code: 'KES', name: 'Kenyan Shilling' },
    { code: 'KGS', name: 'Kyrgystani Som' },
    { code: 'KHR', name: 'Cambodian Riel' },
    { code: 'KMF', name: 'Comorian Franc' },
    { code: 'KRW', name: 'South Korean Won' },
    { code: 'KWD', name: 'Kuwaiti Dinar' },
    { code: 'KYD', name: 'Cayman Islands Dollar' },
    { code: 'KZT', name: 'Kazakhstani Tenge' },
    { code: 'LAK', name: 'Laotian Kip' },
    { code: 'LBP', name: 'Lebanese Pound' },
    { code: 'LKR', name: 'Sri Lankan Rupee' },
    { code: 'LRD', name: 'Liberian Dollar' },
    { code: 'LSL', name: 'Lesotho Loti' },
    { code: 'LYD', name: 'Libyan Dinar' },
    { code: 'MAD', name: 'Moroccan Dirham' },
    { code: 'MDL', name: 'Moldovan Leu' },
    { code: 'MGA', name: 'Malagasy Ariary' },
    { code: 'MKD', name: 'Macedonian Denar' },
    { code: 'MMK', name: 'Myanma Kyat' },
    { code: 'MNT', name: 'Mongolian Tugrik' },
    { code: 'MOP', name: 'Macanese Pataca' },
    { code: 'MRU', name: 'Mauritanian Ouguiya' },
    { code: 'MUR', name: 'Mauritian Rupee' },
    { code: 'MVR', name: 'Maldivian Rufiyaa' },
    { code: 'MWK', name: 'Malawian Kwacha' },
    { code: 'MXN', name: 'Mexican Peso' },
    { code: 'MYR', name: 'Malaysian Ringgit' },
    { code: 'MZN', name: 'Mozambican Metical' },
    { code: 'NAD', name: 'Namibian Dollar' },
    { code: 'NGN', name: 'Nigerian Naira' },
    { code: 'NIO', name: 'Nicaraguan Córdoba' },
    { code: 'NOK', name: 'Norwegian Krone' },
    { code: 'NPR', name: 'Nepalese Rupee' },
    { code: 'NZD', name: 'New Zealand Dollar' },
    { code: 'OMR', name: 'Omani Rial' },
    { code: 'PAB', name: 'Panamanian Balboa' },
    { code: 'PEN', name: 'Peruvian Nuevo Sol' },
    { code: 'PGK', name: 'Papua New Guinean Kina' },
    { code: 'PHP', name: 'Philippine Peso' },
    { code: 'PKR', name: 'Pakistani Rupee' },
    { code: 'PLN', name: 'Polish Złoty' },
    { code: 'PYG', name: 'Paraguayan Guarani' },
    { code: 'QAR', name: 'Qatari Rial' },
    { code: 'RON', name: 'Romanian Leu' },
    { code: 'RSD', name: 'Serbian Dinar' },
    { code: 'RUB', name: 'Russian Ruble' },
    { code: 'RWF', name: 'Rwandan Franc' },
    { code: 'SAR', name: 'Saudi Riyal' },
    { code: 'SBD', name: 'Solomon Islands Dollar' },
    { code: 'SCR', name: 'Seychellois Rupee' },
    { code: 'SDG', name: 'Sudanese Pound' },
    { code: 'SEK', name: 'Swedish Krona' },
    { code: 'SGD', name: 'Singapore Dollar' },
    { code: 'SHP', name: 'Saint Helena Pound' },
    { code: 'SLL', name: 'Sierra Leonean Leone' },
    { code: 'SOS', name: 'Somali Shilling' },
    { code: 'SRD', name: 'Surinamese Dollar' },
    { code: 'STN', name: 'São Tomé and Príncipe Dobra' },
    { code: 'SYP', name: 'Syrian Pound' },
    { code: 'SZL', name: 'Swazi Lilangeni' },
    { code: 'THB', name: 'Thai Baht' },
    { code: 'TJS', name: 'Tajikistani Somoni' },
    { code: 'TMT', name: 'Turkmenistani Manat' },
    { code: 'TND', name: 'Tunisian Dinar' },
    { code: 'TOP', name: 'Tongan Paʻanga' },
    { code: 'TRY', name: 'Turkish Lira' },
    { code: 'TTD', name: 'Trinidad and Tobago Dollar' },
    { code: 'TWD', name: 'New Taiwan Dollar' },
    { code: 'TZS', name: 'Tanzanian Shilling' },
    { code: 'UAH', name: 'Ukrainian Hryvnia' },
    { code: 'UGX', name: 'Ugandan Shilling' },
    { code: 'UYU', name: 'Uruguayan Peso' },
    { code: 'UZS', name: 'Uzbekistani Som' },
    { code: 'VES', name: 'Venezuelan Bolívar' },
    { code: 'VND', name: 'Vietnamese Đồng' },
    { code: 'VUV', name: 'Vanuatu Vatu' },
    { code: 'WST', name: 'Samoan Tala' },
    { code: 'XAF', name: 'Central African CFA Franc' },
    { code: 'XCD', name: 'East Caribbean Dollar' },
    { code: 'XOF', name: 'West African CFA Franc' },
    { code: 'XPF', name: 'CFP Franc' },
    { code: 'YER', name: 'Yemeni Rial' },
    { code: 'ZAR', name: 'South African Rand' },
    { code: 'ZMW', name: 'Zambian Kwacha' },
    { code: 'ZWL', name: 'Zimbabwean Dollar' },

  ]


  constructor(private fb: FormBuilder, private apiServiceService: ApiServiceService) { }

  ngOnInit(): void {
    this.isEditParamData = this.fb.group({
      companyName: ['', Validators.required],
      source: ['', Validators.required],
      destination: ['', Validators.required],
      cargotype: ['', Validators.required],
      transitTime: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      freightType: ['', Validators.required],
      rate: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      currency: ['', Validators.required],
      isDirectShipment: [false],
      transhipment_add_port: [{ value: '', disabled: this.isDirectShipment }],
      effectiveDate: ['', Validators.required],
      expirationDate: ['', Validators.required],
      remarks: [''],
      terms_condition: [''],
      rateType: [''],
      free_days: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      // hazType: [''],
      hazValue: [{ value: '', disabled: this.hazActiveStatus }, [Validators.required, Validators.pattern(/^(?!0000)\d{4}$/)]],
      hazActiveStatus: [false],
      free_days_comment: [''],
    });
    this.getEquipments();
    this.getCompanyList()
    this.getSource()
    this.getDestionation()

    this.getSourceDestinationCombine()

    // console.log(this.isEditData)
  }

  ngOnChanges(changes: SimpleChanges): void {
    const newFormDataModified = {
      companyName: this.formData.company?.name || '',
      destination: this.formData.destination?.name || '',
      source: this.formData.source?.name || '',
      transitTime: this.formData.transit_time?.time || '',
      rate: this.formData?.rate || '',
      currency: this.formData?.currency || '',
      cargotype: this.formData.cargotype || '',
      freightType: this.formData.freight_type?.type || '',
      effectiveDate: this.formData?.effective_date || '',
      expirationDate: this.formData?.expiration_date || '',
      isDirectShipment: this.formData?.direct_shipment || false,
      rateType: this.formData?.spot_filed,
      transhipment_add_port: this.formData.transhipment_add_port,
      remarks: this.formData?.remarks || '',
      terms_condition: this.formData?.terms_condition || '',
      free_days: this.formData?.free_days || '',
      hazActiveStatus: this.formData?.hazardous || false,
      free_days_comment: this.formData?.free_days_comment || '',
      hazValue: this.formData?.un_number,

    }
    if (changes['formData'] && this.formData) {
      this.isEditParamData?.patchValue(newFormDataModified);
    }

    this.formData.direct_shipment ? this.isEditParamData?.get('transhipment_add_port')?.disable() : this.isEditParamData?.get('transhipment_add_port')?.enable()
    this.formData.hazardous ? this.isEditParamData?.get('hazValue')?.enable() : this.isEditParamData?.get('hazValue')?.disable();


    // if (this.formData.direct_shipment === true) {
    //   this.isEditParamData?.get('transhipment_add_port')?.disable();
    // } else {
    //   this.isEditParamData?.get('transhipment_add_port')?.enable();
    // }

    //  ASSIGN ID HERE
    this.updatingIdx = this.formData.unique_uuid
    // console.log(this.formData)
  }


  // Handles input event and filters currency
  onCurrencyInput(event: any) {
    this.currencyInputValue = event.target.value;
    if (this.currencyInputValue.length >= 1) {
      this.filteredCurrencies = this.filterCurrency(this.currencyInputValue);
    } else {
      this.filteredCurrencies = [];
    }
    this.showCurrencyDropdown = true;
  }

  // Handles the selection of a currency
  selectCurrency(currencyCode: string) {
    this.isEditParamData.get('currency')?.setValue(currencyCode);
    this.currencyInputValue = currencyCode; // Update the input with the selected value
    this.showCurrencyDropdown = false;
  }
  // Filtering logic
  filterCurrency(query: string) {
    return this.currencyLists.filter((currency: any) =>
      currency.name.toLowerCase().includes(query.toLowerCase()) ||
      currency.code.toLowerCase().includes(query.toLowerCase())
    );
  }

  hideCurrencyDropdown() {
    setTimeout(() => {
      this.showCurrencyDropdown = false;
      // Clear input if no valid currency is selected
      if (!this.currencyLists.some(currency => currency.code === this.currencyInputValue)) {
        this.isEditParamData.get('currency')?.setValue('');
        this.currencyInputValue = ''; // Clear input if the user hasn't selected a valid currency
      }
    }, 250);// Delay to allow click event to register before hiding
  }

  getSourceDestinationCombine() {
    forkJoin({
      source: this.apiServiceService.getCompanyList('/api/source/'),
      destination: this.apiServiceService.getCompanyList('/api/destination/')
    }).subscribe(({ source, destination }) => {
      // Assign the API responses to their respective lists
      this.sourceList = source;
      this.destinationList = destination;

      // Combine the data from sourceList and destinationList into sourceDestinationTransshipment
      this.sourceDestinationVia = [...this.sourceList, ...this.destinationList];
      // console.log(this.sourceDestinationTransshipment);
    });
  }

  // Toggle radio button value
  // onCheckboxChange(event: any) {
  //   this.hazType = event.target.checked;
  // }

  closeModal() {
    this.isEditVisible = false;
    this.visibilityChange.emit(this.isEditVisible);
  }

  getEquipments() {
    this.apiServiceService.getCompanyList('/api/frighttype/').subscribe(res => {

      this.equipmentsList = res

    })
  }

  getCompanyList() {
    this.apiServiceService.getCompanyList('/api/companies/').subscribe(res => {
      this.companyList = res
    })
  }
  getSource() {
    this.apiServiceService.getCompanyList('/api/source/').subscribe(res => {
      this.sourceList = res
    })
  }
  getDestionation() {
    this.apiServiceService.getCompanyList('/api/destination/').subscribe(res => {
      this.destinationList = res
    })
  }


  updatingFormHandler(): void {
    const transhipmentControl = this.isEditParamData.get('transhipment_add_port');
    if (this.isDirectShipment && transhipmentControl?.disabled) {
      transhipmentControl.enable();
    }
    const modifiedData = {
      company: this.isEditParamData.value.companyName,
      source: this.isEditParamData.value.source,
      destination: this.isEditParamData.value.destination,
      transit_time: this.isEditParamData.value.transitTime,
      freight_type: this.isEditParamData.value.freightType,
      rate: this.isEditParamData.value.rate,
      currency: this.isEditParamData.value.currency,
      cargotype: this.isEditParamData.value.cargotype,
      direct_shipment: this.isEditParamData.value.isDirectShipment,
      spot_filed: this.isEditParamData.value.rateType,
      transhipment_add_port: this.isEditParamData.value.transhipment_add_port,
      effective_date: this.isEditParamData.value.effectiveDate,
      expiration_date: this.isEditParamData.value.expirationDate,
      remarks: this.isEditParamData.value.remarks,
      terms_condition: this.isEditParamData.value.terms_condition,
      free_days: this.isEditParamData.value.free_days,
      free_days_comment: this.isEditParamData.value.free_days_comment,
      hazardous: this.isEditParamData.value.hazActiveStatus,
      un_number: this.isEditParamData.value.hazValue,
    }
    // console.log(modifiedData)
    
    // console.log(this.updatingIdx)
    if (this.isEditParamData.valid) {
      this.apiServiceService.updatingManualRate(`/api/manual-rate/${this.updatingIdx}/`, modifiedData).subscribe(response => {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: `${modifiedData.company.toUpperCase()} updated Successfully`
        });
        this.isEditParamData.reset()
        this.closeModal()
      })
      this.getCompanyList()
    }
    else {
      console.log('Form is not valid');
      this.formData.markAllAsTouched();
    }
  }




  onInput(event: any): void {
    const value = event.target.value.toLowerCase();
    this.filteredCompanies = this.companyList.filter((company: any) =>
      company.name.toLowerCase().includes(value)
    );
    // this.checkCompanyMatch(value);
  }

  selectCompany(name: string) {
    this.isEditParamData.get('companyName')!.setValue(name);
    this.showDropdown = false;
  }


  hideDropdown() {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200); // Delay to allow click event to register before hiding
  }

  onSourceInput(event: any): void {
    const value = event.target.value.toLowerCase();
    console.log(value)
    this.filteredSources = this.sourceList.filter((source: any) =>
      source.name.toLowerCase().includes(value)
    );
  }

  selectSource(name: string) {
    this.isEditParamData.get('source')!.setValue(name);
    this.showSourceDropdown = false;
  }
  hideSourceDropdown() {
    setTimeout(() => {
      this.showSourceDropdown = false;
    }, 200); // Delay to allow click event to register before hiding
  }

  // ********************************* DESTINATION  ********************************************
  onDestinationInput(event: any): void {
    const value = event.target.value.toLowerCase();
    this.filteredDestination = this.destinationList.filter((dest: any) =>
      dest.name.toLowerCase().includes(value)
    );
  }

  selectDestination(name: string) {
    this.isEditParamData.get('destination')!.setValue(name);
    this.showDestinationDropdown = false;
  }
  hideDestinationDropdown() {
    setTimeout(() => {
      this.showDestinationDropdown = false;
    }, 200); // Delay to allow click event to register before hiding
  }

  onDirectShipmentChange(event: any): void {
    this.isDirectShipment = event.target.checked;
    if (this.isDirectShipment) {
      this.isEditParamData.get('transhipment_add_port')?.disable();
    } else {
      this.isEditParamData.get('transhipment_add_port')?.enable();
    }
  }
  // Toggle radio button value
  onHazCheckboxStatusChange(event: any) {
    this.hazActiveStatus = event.target.checked;
    if (this.hazActiveStatus) {
      this.isEditParamData.get('hazValue')?.enable();
    } else {
      this.isEditParamData.get('hazValue')?.disable();
    }

  }

  // toggleRateType(event: any): void {
  //   this.isRateTypeStatus = event.target.checked;
  // }

}


