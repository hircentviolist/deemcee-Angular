import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EnrollmentService} from '../../enrollment.service';
import {Observable} from 'rxjs';
import {DefaultBranchService} from '../../default-branch.service';
import {shareReplay} from 'rxjs/operators';
import {EnrollmentListItem} from '../../model/enrollment-list-item';
import {StructureService} from '../../structure/structure.service';
import {LessonThemeDto} from '../../lesson-theme-dto';
import {VideoAssignmentDto} from '../../model/video-assignment-dto';
import {DomSanitizer} from '@angular/platform-browser';
import {VideoAssignmentComponent} from '../modal/video-assignment/video-assignment.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {GradeDto} from '../../model/grade-dto';
import {Location} from '@angular/common';

@Component({
  selector: 'app-video-assignment-details',
  templateUrl: './video-assignment-details.component.html',
  styleUrls: ['./video-assignment-details.component.css']
})
export class VideoAssignmentDetailsComponent implements OnInit {

  id: number;
  video$: Observable<VideoAssignmentDto>;
  video: VideoAssignmentDto;
  student$: Observable<EnrollmentListItem>;
  student: EnrollmentListItem;
  theme$: Observable<LessonThemeDto>;
  grade$: Observable<GradeDto>;
  grade: GradeDto;
  videoUrl: any;
  videoType: string;

  branch_id: number;
  isDeleting: boolean = false;

  constructor(
    private domSanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private defaultBranchService: DefaultBranchService,
    private enrollmentService: EnrollmentService,
    private structureService: StructureService,
    private modalService: NgbModal,
    public location: Location,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.id = +this.route.snapshot.params.id;
    this.defaultBranchService.defaultBranch$
      .subscribe(branch_id => {
        if (branch_id) {
          this.branch_id = branch_id;
          if (this.id) {
            this.video$ = this.enrollmentService.getVideoAssignment(this.branch_id, this.id)
              .pipe(
                shareReplay()
              );
            this.video$.subscribe(video => {
              this.video = video;

              if (video.video_url.match('www.facebook.com')) {
                this.videoType = 'facebook';
                const embedUrl = 'https://www.facebook.com/plugins/video.php?href=';
                const encodedUrl = encodeURIComponent(video.video_url);
                this.videoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(embedUrl + encodedUrl);
              } else {
                this.videoType = 'youtube';
                const embedUrl = 'https://www.youtube.com/embed';
                const urlParam = video.video_url.split('/');
                const index = urlParam.lastIndexOf('youtu.be') + 1;
                let videoId = '';

                urlParam.forEach((param) => {
                  if (param.includes('watch')) {
                    videoId = param.substring(8);
                  }
                  if (param.includes('youtu.be')) {
                    videoId = urlParam[index];
                  }
                });

                this.videoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(`${embedUrl}/${videoId}?autoplay=1`);
              }

              this.student$ =
                this.enrollmentService.getById(video.student_id, this.branch_id)
                  .pipe(
                    shareReplay()
                  );
              this.student$.subscribe(student => {
                this.student = student;
                this.grade$ = this.structureService.getOneGrade(student.grade_id)
                  .pipe(
                    shareReplay()
                  );
                this.grade$.subscribe(grade => {
                  this.grade = grade;
                })
              });
              this.theme$ = this.structureService.getOneLessonTheme(video.theme_id)
                .pipe(
                  shareReplay()
                );
              this.theme$.subscribe(theme => {
              });
            })
          }
        }
      });
  }

  update() {
    const modalRef = this.modalService.open(VideoAssignmentComponent);
    modalRef.componentInstance.data = {
      ...this.video,
      student_id: this.video.student_id,
      student_name: this.student.name,
      category_id: this.grade.category.id,
    };
    modalRef.result.then(resp => {
      resp.id = this.video.id;
      this.enrollmentService.updateVideoAssignment(this.branch_id, resp).subscribe(res => {
        this.ngOnInit();
      })
    }, err => {})
  }

  delete() {
    if (this.isDeleting) return;

    this.isDeleting = true;

    this.enrollmentService.deleteVideoAssignment(this.branch_id, this.video.id).subscribe(res => {
      this.router.navigate([`../../show/${this.video.student_id}`], {relativeTo: this.route});
    }, err => {
      alert('Something went wrong');
      this.isDeleting = false;
    })
  }
}
