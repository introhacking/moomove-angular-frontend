import { Component, Output, EventEmitter, Input } from '@angular/core';
import { ApiServiceService } from '../services/api-service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rate-list',
  templateUrl: './rate-list.component.html',
  styleUrls: ['./rate-list.component.scss']
})
export class RateListComponent {
  selectedFile: File | null = null;
  selectedFileType: string | undefined;
  companyList: any = []
  sourceList: any = []
  destinationList: any = []
  fileTypesChooseName: any = []
  currentcompanyListData: any = []
  searchText: any
  dataShitForamat: any = '.sx';
  companyID: any;
  currentDate: any;
  snipperDialoug: boolean = false;
  // modal 
  // isModalVisible = false;
  manualRateLists: any = [];
  isEditData: any = {}
  isCloneData: any = {}
  isEditModalVisible = false;
  isCloneModalVisible = false;
  manualFilterChooseFromShippingLine: string = '';
  isDirectShipment: boolean = false;
  commodityFormData!: FormGroup;

  formData!: FormGroup;
  equipmentsList: any = [];
  // companyList: any[] = [];
  filteredCompanies: any[] = [];
  isCompanyMatched: boolean = false;
  // selectedFile: File | null = null;
  showDropdown: boolean = false;
  filteredSources: any[] = [];
  showSourceDropdown: boolean = false;

  filteredDestination: any[] = [];
  showDestinationDropdown: boolean = false;
  selectedId: any = null

  isLoading: boolean = false;  // Tracks loading state



  @Input() isVisible = false;
  @Output() visibilityChange = new EventEmitter<boolean>();


  constructor(private fb: FormBuilder, private apiServiceService: ApiServiceService) { }

  ngOnInit() {
    this.getCurrentDateFormatted()
    this.getCompanyList()
    this.getSource()
    this.getDestionation()
    this.getManualRateData()


    //  FORM  

    this.formData = this.fb.group({
      companyName: ['', Validators.required],
      // logo: [{ value: '', disabled: this.isCompanyMatched }],
      source: ['', Validators.required],
      destination: ['', Validators.required],
      cargotype: ['', Validators.required],
      transitTime: ['', Validators.required],
      freightType: ['', Validators.required],
      rate: ['', Validators.required],
      effectiveDate: ['', Validators.required],
      expirationDate: ['', Validators.required],
      terms_condition: [''],
      transhipment_add_port: [''],
      remarks: [''],
    });

    this.getEquipments();
    this.apiServiceService.getCompanyList('/api/companies/').subscribe((data: any[]) => {
      this.companyList = data;
    });
  }

  getCurrentDateFormatted(): any {
    const currentDate: Date = new Date();

    const year: number = currentDate.getFullYear();
    const month: number = currentDate.getMonth() + 1; // Note: getMonth() returns 0-based index
    const day: number = currentDate.getDate();

    // Ensure month and day are formatted to have leading zeros if necessary
    const formattedMonth: string = month < 10 ? `0${month}` : `${month}`;
    const formattedDay: string = day < 10 ? `0${day}` : `${day}`;

    // Construct the formatted date string
    this.currentDate = `${year}-${formattedMonth}-${formattedDay}`;

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

  ListDatabyId(event: any) {
    // console.log(event);
    this.isLoading = true;
    const selectedIndex = event.target.selectedIndex;
    const selectedOption = event.target.options[selectedIndex];
    const selectedOptionName = selectedOption.textContent || selectedOption.innerText;
    this.manualFilterChooseFromShippingLine = selectedOptionName

    // console.log('Selected option name:', selectedOptionName);

    this.companyID = event.target.value
    //  console.log(this.companyID);

    if (selectedOptionName == 'Cosco') {
      this.dataShitForamat = 'application/pdf'
      this.fileTypesChooseName = 'Pdf'
    } else if (selectedOptionName == 'Interasia') {
      this.dataShitForamat = '.docx,.doc'
      this.fileTypesChooseName = 'Doc'
    } else if (selectedOptionName == 'Emirates') {
      this.dataShitForamat = '.xlsx'
      this.fileTypesChooseName = 'Excel'
    }

    this.getcurrentDataList()


  }
  getcurrentDataList() {
    this.apiServiceService.complanyListDataById('/api/company-rates/', this.companyID).subscribe(res => {
      this.currentcompanyListData = res
      this.isLoading = false;
      
      // console.log(this.currentcompanyListData)
      // console.log(res, "refresh ssuceessfully");


    })
  }

  onFileSelected(event: any) {

    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.snipperDialoug = true
      this.selectedFile = inputElement.files[0];
      this.selectedFileType = this.selectedFile.type;
      // console.log(">>>>",this.selectedFileType);
      console.log(this.selectedFileType);
      const formData = new FormData();
      const fileInput = document.getElementById('input-file') as HTMLInputElement;

      if (fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        formData.append('file', file, file.name);
        formData.append('company_id', this.companyID);

        if (this.selectedFileType == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          this.apiServiceService.submitFileData('/api/import-excel/', formData).subscribe(res => {
            console.log(" excel successfully Updated");

            this.getcurrentDataList()
            this.snipperDialoug = false
          }),
            (error: any) => {
              console.log(error);

            }

        } else if (this.selectedFileType == 'application/pdf') {
          this.apiServiceService.submitFileData('/api/extract-pdf-table/', formData).subscribe(res => {
            console.log(res)
            console.log(" pdf successfully Updated");

            this.getcurrentDataList()
            this.snipperDialoug = false

          }),
            (error: any) => {
              console.log(error);

            }

        } else if (this.selectedFileType == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          this.apiServiceService.submitFileData('/api/extract-word-table/', formData).subscribe(res => {
            console.log(" word successfully Updated");
            this.getcurrentDataList()
            this.snipperDialoug = false

          }),
            (error: any) => {
              console.log(error);

            }

        }



      }
    }

  }

  handleEditVisibilityChange(isEditVisible: boolean) {
    this.isEditModalVisible = isEditVisible;
  }

  handleCloneVisibilityChange(isCloneVisible: boolean) {
    this.isCloneModalVisible = isCloneVisible;
  }


  getManualRateData() {
    this.apiServiceService.getCompanyList('/api/manual-rate/').subscribe(res => {
      this.manualRateLists = res;
      console.log(res)
      // this.companyList.push({ name: this.companyList });
    })
  }

  // EDIT MODAL OPEN HERE
  openManualEditModal(data: any) {
    // this.isEditData.emit(data)
    this.isEditData = data
    this.isEditModalVisible = true;
  }

  openManualCloneModal(data: any) {
    // this.isCloneData.emit(data)
    this.isCloneData = data
    this.isCloneModalVisible = true;
  }

  selectedTab: string = 'MANUAL RATE'; // Default selected tab
  selectTab(tab: string): void {
    this.selectedTab = tab;
  }


  onInput(event: any): void {
    // const input = event.target as HTMLInputElement;
    // const searchValue = input.value;
    // this.filteredCompanies = of(this._filter(searchValue));

    const value = event.target.value.toLowerCase();
    this.filteredCompanies = this.companyList.filter((company: any) =>
      company.name.toLowerCase().includes(value)
    );
    // this.checkCompanyMatch(value);
  }

  selectCompany(name: string) {
    this.formData.get('companyName')!.setValue(name);
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
    // this.checkCompanyMatch(value);
  }

  selectSource(name: string) {
    this.formData.get('source')!.setValue(name);
    this.showSourceDropdown = false;
    // this.checkCompanyMatch(name);
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
    // this.checkCompanyMatch(value);
  }

  selectDestination(name: string) {
    this.formData.get('destination')!.setValue(name);
    this.showDestinationDropdown = false;
    // this.checkCompanyMatch(name);
  }
  hideDestinationDropdown() {
    setTimeout(() => {
      this.showDestinationDropdown = false;
    }, 200); // Delay to allow click event to register before hiding
  }


  getEquipments() {
    this.apiServiceService.getCompanyList('/api/frighttype/').subscribe(res => {

      this.equipmentsList = res

    })
  }

  onSubmitHandler(): void {
    // const formData = new FormData();
    // formData.append('company', this.formData.value.companyName)
    // formData.append('source', this.formData.value.source)
    // formData.append('destination', this.formData.value.destination)
    // formData.append('cargotype', this.formData.value.cargotype)
    // formData.append('transit_time', this.formData.value.transitTime)
    // formData.append('freight_type', this.formData.value.freightType)
    // formData.append('rate', this.formData.value.rate)
    // formData.append('effective_date', this.formData.value.effectiveDate)
    // formData.append('expiration_date', this.formData.value.expirationDate)
    // formData.append('remarks', this.formData.value.remarks)
    // if (this.selectedFile) {
    //   formData.append('logo', this.selectedFile);
    // }

    const modifiedData = {
      company: this.formData.value.companyName,
      source: this.formData.value.source,
      destination: this.formData.value.destination,
      cargotype: this.formData.value.cargotype,
      transit_time: this.formData.value.transitTime,
      freight_type: this.formData.value.freightType,
      direct_shipment: this.isDirectShipment,
      rate: this.formData.value.rate,
      terms_condition: this.formData.value.terms_condition,
      transhipment_add_port: this.formData.value.transhipment_add_port,
      effective_date: this.formData.value.effectiveDate,
      expiration_date: this.formData.value.expirationDate,
      remarks: this.formData.value.remarks,
    }
    console.log(modifiedData);


    // console.log(formData)
    this.apiServiceService.addManualRate('/api/manual-rate/', modifiedData).subscribe(response => {
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
        title: `${this.formData.value.companyName.toUpperCase()} Added Successfully`
      });
      this.formData.reset();
      this.isDirectShipment = false
      this.getCompanyList()
      this.getManualRateData()
    })
  }

  onDirectShipmentChange(event: any): void {
    this.isDirectShipment = event.target.checked;
  }

  openDeleteModal(id: number) {
    this.selectedId = id
  }
  deleteModalConfirmation() {
    if (this.selectedId) {
      this.apiServiceService.deleteManualRate(`/api/manual-rate/delete/${this.selectedId}/`).subscribe(response => {
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
          title: `Deleted Successfully`
        });
        this.getCompanyList()
      })
    }
    else {
      console.log('Form is not valid');
    }
  }










}
