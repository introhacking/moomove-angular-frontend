import { Component, EventEmitter, Output, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiServiceService } from 'src/app/services/api-service.service';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-clone-manual-rate',
  templateUrl: './clone-manual-rate.component.html',
  styleUrls: ['./clone-manual-rate.component.scss']
})

export class CloneManualRateComponent implements OnInit, OnChanges {
  @Input() formData!: any;
  @Input() isCloneVisible = false;
  @Output() visibilityChange = new EventEmitter<boolean>();

  @Output() dataUpdated = new EventEmitter<void>(); // New Output for data update

  isCloneParamData!: FormGroup;
  equipmentsList: any = [];
  isCloneData: any = {}


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
  serverResposeMessage: any = ''

  isRateTypeStatus: boolean = false
  rateType: string = 'filed';

  sourceDestinationVia: any[] = []
  // hazType: boolean = false;

  todayDate: string = new Date().toISOString().split('T')[0]; // Current date for validFrom
  minExpirationDate: string = ''; // Dynamic min expiration date

  hazActiveStatus: boolean = false;
  showCurrencyDropdown: boolean = false;
  filteredCurrencies: any[] = [];
  currencyInputValue: string = '';


  // Via(Combine source and destionation)
  selectedVia: string[] = [];
  showViaDropdown: boolean = false;
  filteredVia: any[] = [];
  viaInputValue: string = '';

  // Haz Class
  showHazClassDropdown: boolean = false;
  filteredHazClass: any[] = [];
  hazClassInputValue: string = '';


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

  packingGp = [
    { pckgp: 'I' },
    { pckgp: 'II' },
    { pckgp: 'III' },
    { pckgp: 'IV' },
    { pckgp: 'V' },
    { pckgp: 'VI' },
    { pckgp: 'VII' },
    { pckgp: 'VIII' },
    { pckgp: 'IX' },
  ]

  hazClassValue = [
    { hazClass: '0.1' },
    { hazClass: '0.2' },
    { hazClass: '0.3' },
    { hazClass: '0.4' },
    { hazClass: '0.5' },
    { hazClass: '0.6' },
    { hazClass: '0.7' },
    { hazClass: '0.8' },
    { hazClass: '0.9' },
    { hazClass: '1.0' },
    { hazClass: '1.1' },
    { hazClass: '1.2' },
    { hazClass: '1.3' },
    { hazClass: '1.4' },
    { hazClass: '1.5' },
    { hazClass: '1.6' },
    { hazClass: '1.7' },
    { hazClass: '1.8' },
    { hazClass: '1.9' },
    { hazClass: '2.0' },
    { hazClass: '2.1' },
    { hazClass: '2.2' },
    { hazClass: '2.3' },
    { hazClass: '2.4' },
    { hazClass: '2.5' },
    { hazClass: '2.6' },
    { hazClass: '2.7' },
    { hazClass: '2.8' },
    { hazClass: '2.9' },
    { hazClass: '3.0' },
    { hazClass: '3.1' },
    { hazClass: '3.2' },
    { hazClass: '3.3' },
    { hazClass: '3.4' },
    { hazClass: '3.5' },
    { hazClass: '3.6' },
    { hazClass: '3.7' },
    { hazClass: '3.8' },
    { hazClass: '3.9' },
    { hazClass: '4.0' },
    { hazClass: '4.1' },
    { hazClass: '4.2' },
    { hazClass: '4.3' },
    { hazClass: '4.4' },
    { hazClass: '4.5' },
    { hazClass: '4.6' },
    { hazClass: '4.7' },
    { hazClass: '4.8' },
    { hazClass: '4.9' },
    { hazClass: '5.0' },
    { hazClass: '5.1' },
    { hazClass: '5.2' },
    { hazClass: '5.3' },
    { hazClass: '5.4' },
    { hazClass: '5.5' },
    { hazClass: '5.6' },
    { hazClass: '5.7' },
    { hazClass: '5.8' },
    { hazClass: '5.9' },
    { hazClass: '6.0' },
    { hazClass: '6.1' },
    { hazClass: '6.2' },
    { hazClass: '6.3' },
    { hazClass: '6.4' },
    { hazClass: '6.5' },
    { hazClass: '6.6' },
    { hazClass: '6.7' },
    { hazClass: '6.8' },
    { hazClass: '6.9' },
    { hazClass: '7.0' },
    { hazClass: '7.1' },
    { hazClass: '7.2' },
    { hazClass: '7.3' },
    { hazClass: '7.4' },
    { hazClass: '7.5' },
    { hazClass: '7.6' },
    { hazClass: '7.7' },
    { hazClass: '7.8' },
    { hazClass: '7.9' },
    { hazClass: '8.0' },
    { hazClass: '8.1' },
    { hazClass: '8.2' },
    { hazClass: '8.3' },
    { hazClass: '8.4' },
    { hazClass: '8.5' },
    { hazClass: '8.6' },
    { hazClass: '8.7' },
    { hazClass: '8.8' },
    { hazClass: '8.9' },
    { hazClass: '9.0' },
    { hazClass: '9.1' },
    { hazClass: '9.2' },
    { hazClass: '9.3' },
    { hazClass: '9.4' },
    { hazClass: '9.5' },
    { hazClass: '9.6' },
    { hazClass: '9.7' },
    { hazClass: '9.8' },
    { hazClass: '9.9' }
  ]



  constructor(private fb: FormBuilder, private apiServiceService: ApiServiceService) { }

  ngOnInit(): void {
    this.isCloneParamData = this.fb.group({
      companyName: ['', Validators.required],
      source: ['', Validators.required],
      destination: ['', Validators.required],
      cargotype: [{ value: '', disabled: false }, Validators.required],
      transitTime: ['', Validators.required],
      freightType: ['', Validators.required],
      rate: ['', Validators.required],
      currency: ['', Validators.required],
      isDirectShipment: [false],
      transhipment_add_port: [{ value: '', disabled: this.isDirectShipment }, Validators.required],
      effectiveDate: ['', Validators.required],
      expirationDate: ['', Validators.required],
      isRateTypeStatus: [this.isRateTypeStatus],
      vessel_name: [{ value: '', disabled: !this.isRateTypeStatus }, Validators.required],
      voyage: [{ value: '', disabled: !this.isRateTypeStatus }, Validators.pattern(/^[a-zA-Z0-9]{3,10}$/)],
      haz_class: ['', Validators.required],
      packing_group: ['', Validators.required],
      remarks: [''],
      terms_condition: [''],
      rateType: [this.rateType],
      free_days: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      hazValue: [{ value: '', disabled: this.hazActiveStatus }, [Validators.required, Validators.pattern(/^(?!0000)\d{4}$/)]],
      hazActiveStatus: [false],
      free_days_comment: [''],
    });

    // Set up listener for rate type change
    this.isCloneParamData.get('isRateTypeStatus')?.valueChanges.subscribe(status => {
      this.onRateCheckboxStatusChange({ target: { checked: status } });
    });

    this.getEquipments();
    this.getCompanyList()
    this.getSource()
    this.getDestionation()
    this.getSourceDestinationCombine()
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
      vessel_name: this.formData?.vessel_name,
      voyage: this.formData?.voyage,
      haz_class: this.formData?.haz_class || '',
      packing_group: this.formData?.packing_group || '',
      isDirectShipment: this.formData?.direct_shipment || false,
      isRateTypeStatus: this.formData?.isRateTypeStatus || false,
      rateType: this.formData?.spot_filed || 'spot',
      // transhipment_add_port: this.formData?.transhipment_add_port || '',
      remarks: this.formData?.remarks || '',
      terms_condition: this.formData?.terms_condition || '',
      free_days: this.formData?.free_days || '',
      hazActiveStatus: this.formData?.hazardous || false,
      free_days_comment: this.formData?.free_days_comment || '',
      hazValue: this.formData?.un_number,

    }

    if (changes['formData'] && this.formData?.transhipment_add_port) {
      // Split the existing string data into an array and assign it to `selectedVia`
      this.selectedVia = this.formData.transhipment_add_port.split(',').map((item: any) => item.trim());
      this.updateFormControl();
    }

    if (changes['formData'] && this.formData) {
      this.isCloneParamData?.patchValue(newFormDataModified);
      console.log(this.formData)
    }

    this.hazActiveStatus = this.formData?.hazardous || false;
    // console.log(this.hazActiveStatus)
    if (this.hazActiveStatus) {
      this.isCloneParamData?.get('hazValue')?.enable();
      this.isCloneParamData?.get('haz_class')?.enable();
      this.isCloneParamData?.get('packing_group')?.enable();
      this.isCloneParamData?.get('cargotype')?.disable();
    } else {
      this.isCloneParamData?.get('hazValue')?.disable();
      this.isCloneParamData?.get('haz_class')?.disable();
      this.isCloneParamData?.get('packing_group')?.disable();
      this.isCloneParamData?.get('cargotype')?.enable();
    }
    // this.formData.hazardous ? this.isCloneParamData?.get('hazValue')?.enable() : this.isCloneParamData?.get('hazValue')?.disable();

    // console.log(this.isCloneParamData)
    // console.log(this.formData)
    this.formData.isRateTypeStatus ? this.isCloneParamData?.get('spot_filed')?.disable() : this.isCloneParamData?.get('spot_filed')?.enable()


    if (this.formData.direct_shipment) {
      this.isCloneParamData?.get('transhipment_add_port')?.disable();
    } else {
      this.isCloneParamData?.get('transhipment_add_port')?.enable();
    }

  }


  // Update the minimum expiration date based on the selected validFrom date
  onValidFromChange() {
    const validFromDate = this.isCloneParamData.get('effectiveDate')?.value;

    if (validFromDate) {
      // Update the minimum expiration date to the selected validFrom date
      this.minExpirationDate = validFromDate;

      // Check if the current expiration date is earlier than the new validFrom date
      const expirationDate = this.isCloneParamData.get('expirationDate')?.value;
      if (expirationDate && expirationDate < validFromDate) {
        // If expiration date is earlier, clear the expiration date
        this.isCloneParamData.get('expirationDate')?.setValue('');
      }
    }
  }

  // Handle when expiration date is changed
  onExpirationDateChange() {
    const validFromDate = this.isCloneParamData.get('effectiveDate')?.value;
    const expirationDate = this.isCloneParamData.get('expirationDate')?.value;

    // Ensure the expiration date is not earlier than the validFrom date
    if (validFromDate && expirationDate < validFromDate) {
      this.isCloneParamData.get('expirationDate')?.setErrors({ invalidDate: true });
    } else {
      this.isCloneParamData.get('expirationDate')?.setErrors(null);
    }
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
    this.isCloneParamData.get('currency')?.setValue(currencyCode);
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
        this.isCloneParamData.get('currency')?.setValue('');
        this.currencyInputValue = ''; // Clear input if the user hasn't selected a valid currency
      }
    }, 250);// Delay to allow click event to register before hiding
  }

  onViaInput(event: any) {
    const input = event.target.value;
    this.viaInputValue = input;
    this.filteredVia = this.filterVia(input);  // Filter the list based on input
    this.showViaDropdown = true;  // Show the dropdown while typing
  }

  // Handles the selection of a currency
  selectVia(viaName: string) {
    if (!this.selectedVia.includes(viaName)) {
      this.selectedVia.push(viaName);
    }

    // Clear the input field after selection
    this.viaInputValue = '';
    this.showViaDropdown = false;  // Hide the dropdown after selection
    this.updateFormControl();  // Update the form control with the selected values
  }


  // Check if an item is already selected
  isSelected(viaName: string): boolean {
    return this.selectedVia.includes(viaName);
  }

  updateFormControl() {
    this.isCloneParamData?.get('transhipment_add_port')!.setValue(this.selectedVia.join(', '));
  }

  // Method to add new via when it's not found in the list
  addNewVia(via: string) {
    const trimmedVia = via.trim();
    if (trimmedVia && !this.selectedVia.includes(trimmedVia)) {
      this.selectedVia.push(trimmedVia);
      this.updateFormControl(); // Update form control with the new value
      this.viaInputValue = ''; // Clear the input field after adding the value
      this.showViaDropdown = false; // Optionally, hide the dropdown after adding
      this.filteredVia = []; // Clear the filtered results
    }
  }

  // Remove an option from the selected list
  removeVia(via: string) {
    const index = this.selectedVia.indexOf(via);
    if (index > -1) {
      this.selectedVia.splice(index, 1);  // Remove the item from selectedVia array
      this.updateFormControl();  // Update the form control after removal
    }
  }

  filterVia(query: string) {
    return this.sourceDestinationVia.filter((transhipmentPort: any) =>
      transhipmentPort.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  hideViaDropdown() {
    setTimeout(() => {
      this.showViaDropdown = false;
    }, 200);
  }

  // Handles input event and filters currency
  onHazClassInput(event: any) {
    this.hazClassInputValue = event.target.value;
    if (this.hazClassInputValue.length >= 1) {
      this.filteredHazClass = this.filterHazClass(this.hazClassInputValue);
    } else {
      this.filteredHazClass = [];
    }
    this.showHazClassDropdown = true;
  }

  // Handles the selection of a currency
  selectHazClass(hazValue: string) {
    this.isCloneParamData.get('haz_class')!.setValue(hazValue);
    this.hazClassInputValue = hazValue; // Update the input with the selected value
    this.showHazClassDropdown = false;
  }
  // Filtering logic
  filterHazClass(query: string) {
    return this.hazClassValue.filter((hazClass: any) =>
      hazClass.hazClass.toLowerCase().includes(query.toLowerCase())
      // ||
      //   hazClass.code.toLowerCase().includes(query.toLowerCase())
    );
  }

  hideHazClassDropdown() {
    setTimeout(() => {
      this.showHazClassDropdown = false;
      // Clear input if no valid hazClass is selected
      if (!this.hazClassValue.some(hazClass => hazClass.hazClass === this.hazClassInputValue)) {
        this.isCloneParamData.get('haz_class')!.setValue('');
        this.hazClassInputValue = ''; // Clear input if the user hasn't selected a valid currency
        this.showHazClassDropdown = false;
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
    this.isCloneVisible = false;
    this.visibilityChange.emit(this.isCloneVisible);
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

  addingNewFormHandler(): void {
    const transhipmentControl = this.isCloneParamData.get('transhipment_add_port');
    if (this.isDirectShipment && transhipmentControl?.disabled) {
      transhipmentControl.enable();
    }
    // const cargotypeValue = this.formData.get('cargotype')?.value || null; // Provide default value if needed
    const modifiedData = {
      company: this.isCloneParamData.value.companyName,
      source: this.isCloneParamData.value.source,
      destination: this.isCloneParamData.value.destination,
      transit_time: this.isCloneParamData.value.transitTime,
      freight_type: this.isCloneParamData.value.freightType,
      rate: this.isCloneParamData.value.rate,
      currency: this.isCloneParamData.value.currency,
      cargotype: this.isCloneParamData.value.cargotype || '',
      direct_shipment: this.isCloneParamData.value.isDirectShipment,
      isRateTypeStatus: this.isCloneParamData.value.isRateTypeStatus,
      spot_filed: this.rateType,
      transhipment_add_port: this.isCloneParamData.value.transhipment_add_port,
      effective_date: this.isCloneParamData.value.effectiveDate,
      expiration_date: this.isCloneParamData.value.expirationDate,
      remarks: this.isCloneParamData.value.remarks,
      terms_condition: this.isCloneParamData.value.terms_condition,
      free_days: this.isCloneParamData.value.free_days,
      free_days_comment: this.isCloneParamData.value.free_days_comment,
      hazardous: this.isCloneParamData.value.hazActiveStatus,
      un_number: this.isCloneParamData.value.hazValue,
      vessel_name: this.isCloneParamData.value.vessel_name,
      voyage: this.isCloneParamData.value.voyage,
      haz_class: this.isCloneParamData.value.haz_class,
      packing_group: this.isCloneParamData.value.packing_group,
    }

    // console.log(modifiedData)
    if (this.isCloneParamData.valid) {
      this.apiServiceService.addManualRate(`/api/manual-rate/`, modifiedData).subscribe(response => {
        if (response.message === 'already exists') {
          this.serverResposeMessage = 'This Rate already exists'
          return
        }
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
          title: `${modifiedData.company.toUpperCase()} added Successfully`
        });
        this.isCloneParamData.reset()
        if (this.isDirectShipment) {
          transhipmentControl?.disable();
        }
        this.closeModal()
        this.dataUpdated.emit();
      })
    }
    else {
      console.log('Form is not valid');
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
    this.isCloneParamData.get('companyName')!.setValue(name);
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
    this.isCloneParamData.get('source')!.setValue(name);
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
    this.isCloneParamData.get('destination')!.setValue(name);
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
      this.isCloneParamData.get('transhipment_add_port')?.disable();
    } else {
      this.isCloneParamData.get('transhipment_add_port')?.enable();
    }
  }

  // Toggle radio button value
  onHazCheckboxStatusChange(event: any) {
    this.hazActiveStatus = event.target.checked;
    if (this.hazActiveStatus) {
      this.isCloneParamData.get('hazValue')?.enable();
      this.isCloneParamData?.get('haz_class')?.enable();
      this.isCloneParamData?.get('packing_group')?.enable();
      this.isCloneParamData?.get('cargotype')?.disable();
    } else {
      this.isCloneParamData.get('hazValue')?.disable();
      this.isCloneParamData?.get('haz_class')?.disable();
      this.isCloneParamData?.get('packing_group')?.disable();
      this.isCloneParamData?.get('cargotype')?.enable();
    }

  }

  onRateCheckboxStatusChange(event: any): void {
    this.isRateTypeStatus = event.target.checked;
    if (this.isRateTypeStatus) {
      this.isCloneParamData.get('vessel_name')?.enable();
      this.isCloneParamData.get('voyage')?.enable();
      this.isCloneParamData.get('expirationDate')?.disable();
      this.rateType = 'spot'

    } else {
      this.isCloneParamData.get('vessel_name')?.disable();
      this.isCloneParamData.get('voyage')?.disable();
      this.isCloneParamData.get('expirationDate')?.enable();
      this.rateType = 'filed'
    }
    this.isCloneParamData.get('spot_filed')?.setValue(this.rateType);
  }
}
