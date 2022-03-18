import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PostsService } from './posts.service';

export interface Posts {
  id: number;
  userId?: number;
  title: string;
  body: string;
}
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  searchTxt: string = '';
  filteredArray: Posts[] = [];
  dataArray: Posts[] = [];
  search: boolean = false;
  hideBtn: boolean = true;
  loading: boolean = false;
  constructor(private postService: PostsService) {}

  ngOnInit() {
    this.loading = true;
    this.postService.getPosts().subscribe((data: any) => {
      this.loading = false;
      this.dataArray = data;
      this.dataArray = this.dataArray.slice(0, 10);
      this.dataArray.forEach((p) => {
        this.filteredArray.push(p);
      });
    });
  }

  form = new FormGroup({
    id: new FormControl('', [Validators.required, Validators.minLength(10)]),
    title: new FormControl(''),
    body: new FormControl(''),
  });

  addRow() {
    this.filteredArray.push({
      id: this.form.controls['id'].value,
      title: this.form.controls['title'].value,
      body: this.form.controls['body'].value,
    });
    this.form.reset();
  }
  deleteRow(index: number) {
    this.filteredArray.splice(index, 1);
  }
  showSearch() {
    this.search = true;
    this.hideBtn = false;
  }

  applyFilter() {
    if (this.searchTxt) {
      this.filteredArray = this.dataArray.filter((data) => {
        return (
          data.body.includes(this.searchTxt) ||
          data.title.includes(this.searchTxt) ||
          data.id.toString().includes(this.searchTxt) ||
          data.userId?.toString()?.includes(this.searchTxt)
        );
      });
    } else {
      this.filteredArray = [];
      this.dataArray.forEach((p) => {
        this.filteredArray.push(p);
      });
    }
  }
}
