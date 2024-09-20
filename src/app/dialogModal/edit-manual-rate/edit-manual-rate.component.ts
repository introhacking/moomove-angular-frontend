import { Component, EventEmitter, Output, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiServiceService } from 'src/app/services/api-service.service';
import Swal from 'sweetalert2';

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
  isDirectShipment: boolean | undefined;
  updatingIdx : any = ''


  constructor(private fb: FormBuilder, private apiServiceService: ApiServiceService) { }

  ngOnInit(): void {
    this.isEditParamData = this.fb.group({
      companyName: [''],
      source: [''],
      destination: [''],
      cargotype: [''],
      transitTime: [''],
      freightType: [''],
      rate: [''],
      isDirectShipment:[false],
      transhipment_add_port:[''],
      effectiveDate: [''],
      expirationDate: [''],
      remarks: [''],
      terms_condition: [''],
    });
    this.getEquipments();
    this.getCompanyList()
    this.getSource()
    this.getDestionation()
  }

  ngOnChanges(changes: SimpleChanges): void {
    const newFormDataModified = {
      companyName: this.formData.company?.name,
      destination: this.formData.destination.name,
      source: this.formData.source.name,
      transitTime: this.formData.transit_time.time,
      rate: this.formData.rate,
      cargotype: this.formData.cargotype,
      freightType: this.formData.freight_type.type,
      effectiveDate: this.formData.effective_date,
      expirationDate: this.formData.expiration_date,
      isDirectShipment: this.formData.direct_shipment,
      transhipment_add_port: this.formData.transhipment_add_port,
      remarks: this.formData.remarks,
      terms_condition:this.formData.terms_condition,

    }
    if (changes['formData'] && this.formData) {
      this.isEditParamData?.patchValue(newFormDataModified);
    }

    //  ASSIGN ID HERE
    this.updatingIdx = this.formData.id
    console.log(this.formData)
  }

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
    const modifiedData = {
      company: this.isEditParamData.value.companyName,
      source: this.isEditParamData.value.source,
      destination: this.isEditParamData.value.destination,
      transit_time: this.isEditParamData.value.transitTime,
      freight_type: this.isEditParamData.value.freightType,
      rate: this.isEditParamData.value.rate,
      cargotype: this.isEditParamData.value.cargotype,
      direct_shipment: this.isEditParamData.value.isDirectShipment,
      transhipment_add_port: this.isEditParamData.value.transhipment_add_port,
      effective_date: this.isEditParamData.value.effectiveDate,
      expiration_date: this.isEditParamData.value.expirationDate,
      remarks: this.isEditParamData.value.remarks,
      terms_condition: this.isEditParamData.value.terms_condition,
    }

    console.log(modifiedData)
    console.log(this.updatingIdx)
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
          title: `${modifiedData.company.toUpperCase()} Updated Successfully`
        });
        this.isEditParamData.reset()
        this.closeModal()
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
  }
}

