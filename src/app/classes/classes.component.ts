import { Component, OnInit } from '@angular/core';
import { TitleService } from 'app/shared/title.service';

@Component({
	selector: 'app-classes',
	templateUrl: './classes.component.html',
	styleUrls: ['./classes.component.css']
})
export class ClassesComponent implements OnInit {

	constructor(
		private titleService: TitleService
	) {
		this.titleService.postTitle('Classes')
	}

	ngOnInit(): void {
	}

}
