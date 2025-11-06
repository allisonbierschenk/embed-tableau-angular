import { Component, ElementRef, ViewChild, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { TableauViz } from '@tableau/embedding-api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('viewingViz') viewingViz!: ElementRef;

  private viewing!: TableauViz;
  public vizUrl: string = 'https://public.tableau.com/views/IBMBillingOrdersDashboards/NewSummaryDashboard?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link';

  ngOnInit(): void {
    // ViewChild is not available yet in ngOnInit
  }

  ngAfterViewInit(): void {
    this.loadTableauViz();
  }

  ngOnDestroy(): void {
    if (this.viewing) {
      this.viewing.remove();
    }
  }

  async loadTableauViz(): Promise<void> {
    if (!this.viewingViz?.nativeElement) {
      console.error('ViewChild viewingViz is not available');
      return;
    }

    this.viewing = new TableauViz();
    this.viewing.width = '100%';
    this.viewing.height = '600px';
    this.viewing.src = this.vizUrl;
    this.viewingViz.nativeElement.appendChild(this.viewing);
  }
}
