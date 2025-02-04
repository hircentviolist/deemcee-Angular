import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs';
import {NotificationService} from '../notification.service';
import {DataForSelect} from '../../model/data-for-select';
import {NotificationDto} from '../../model/notification-dto';

@Component({
  selector: 'app-create-notification-modal',
  templateUrl: './create-notification-modal.component.html',
  styleUrls: ['./create-notification-modal.component.css']
})
export class CreateNotificationModalComponent implements OnInit {
  @Input() data;
  notificationForm: FormGroup;
  notificationType$: Observable<DataForSelect[]>;
  mode = 'create';
  audienceGroup = [
    {
      key: 'de_live_parent',
      name: 'DeLive Parent',
      checked: false,
    },
    {
      key: 'de_shop_parent',
      name: 'DeShop Parent',
      checked: false,
    },
    {
      key: 'branch',
      name: 'Branch',
      checked: false,
    }
  ];

  constructor(
    public activeModal: NgbActiveModal,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.notificationType$ = this.notificationService.getNotificationTypes();
    this.notificationType$.subscribe(notificationTypes => {
      console.log('notificationTypes: ', notificationTypes);
    });
    this.initializeForm();
  }

  get audienceFormArray() {
    return this.notificationForm.controls.audienceGroup as FormArray;
  }

  initializeForm() {
    this.notificationForm = new FormGroup({
      type_id: new FormControl(null),
      subject: new FormControl(''),
      description: new FormControl(''),
      audienceGroup: new FormArray([]),
      audience: new FormArray([]),
    });
    this.addAudience();
    if (this.data?.notificationGroup) {
      this.mode = 'view';
      this.notificationForm.patchValue({
        type_id: this.data?.notificationGroup.type_id,
        subject: this.data?.notificationGroup.subject,
        description: this.data?.notificationGroup.description,
      });
      this.notificationForm.disable();
    }
  }

  addAudience() {
    this.audienceGroup.forEach(audience => {
      this.audienceFormArray.push(new FormControl(false));
    })
  }

  create() {
    const selectedAudience = this.notificationForm.value.audienceGroup
      .map((checked, i) => checked ? this.audienceGroup[i] : null)
      .filter(v => v !== null);
    const selectedAudienceKey = [];
    selectedAudience.map(audience => {
      selectedAudienceKey.push(audience.key);
    });
    this.notificationForm.value.audience = selectedAudienceKey;
    this.activeModal.close(this.notificationForm.value);
  }

  onNotificationTypeChange(typeId) {}
}
