import { Component, ElementRef, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnDestroy, AfterViewInit {
  @ViewChild('viewingViz') viewingViz!: ElementRef;
  private viewing: any = null;

  public vizUrl: string = 'https://public.tableau.com/views/EBTMOBillingOrders/v2NewSummaryDashboard2?:language=en-US&:sid=&:redirect=auth&publish=yes&showOnboarding=true&:display_count=n&:origin=viz_share_link';
  public showDepartmentFilter: boolean = false;
  public showDatePeriodFilter: boolean = false;
  public showSelectedDepartmentFilter: boolean = false;
  public isFilterPanelOpen: boolean = false;
  public departmentFilterFieldName: string = 'Department Drill';
  public selectedDepartment: string = '';
  public availableDepartments: string[] = ['Overall', 'Department'];
  public selectedDepartmentDetailFieldName: string = 'Selected Department';
  public selectedDepartmentDetail: string = '';
  public availableDepartmentDetails: string[] = ['Cabin Crew Services', 'Corporate HQ', 'Flight Operations', 'Ground Support'];
  public datePeriodFilterFieldName: string = 'MY(Reporting Date)';
  public selectedDatePeriods: string[] = [];
  public availableDatePeriods: string[] = [
    'December 2024',
    'January 2025',
    'February 2025',
    'March 2025',
    'April 2025',
    'May 2025',
    'June 2025',
    'July 2025',
    'August 2025',
    'September 2025',
    'October 2025',
    'November 2025'
  ];

  get departmentFilterValues(): string[] {
    return ['All', ...this.availableDepartments];
  }

  get departmentDetailFilterValues(): string[] {
    return ['All', ...this.availableDepartmentDetails];
  }

  get datePeriodFilterValues(): string[] {
    return ['All', ...this.availableDatePeriods];
  }

  get isDepartmentSelected(): boolean {
    return this.selectedDepartment === 'Department';
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
    if (!this.viewingViz?.nativeElement) return;

    const maxAttempts = 10;
    let attempts = 0;

    const waitForTableau = () => {
      return new Promise<void>((resolve) => {
        const checkTableau = () => {
          attempts++;
          if (typeof document.createElement === 'function') {
            const testElement = document.createElement('tableau-viz');
            if (testElement) {
              resolve();
              return;
            }
          }
          if (attempts < maxAttempts) {
            setTimeout(checkTableau, 100);
          } else {
            resolve();
          }
        };
        checkTableau();
      });
    };

    await waitForTableau();

    this.viewing = document.createElement('tableau-viz');
    this.viewing.setAttribute('id', 'tableauDashboardViz');
    this.viewing.setAttribute('src', this.vizUrl);
    this.viewing.setAttribute('width', '1200px');
    this.viewing.setAttribute('height', '880px');
    this.viewing.setAttribute('hide-tabs', 'true');
    this.viewing.setAttribute('toolbar', 'hidden');

    this.viewingViz.nativeElement.appendChild(this.viewing);
  }

  async toggleDepartmentValue(value: string): Promise<void> {
    if (value === 'All') {
      this.selectedDepartment = '';
      this.selectedDepartmentDetail = '';
    } else {
      this.selectedDepartment = value;
      if (value === 'Department') {
        this.selectedDepartmentDetail = '';
      }
    }
    await this.applyDepartmentFilter();
  }

  async toggleDatePeriodValue(value: string): Promise<void> {
    if (value === 'All') {
      this.selectedDatePeriods = [];
    } else if (this.selectedDatePeriods.includes(value)) {
      this.selectedDatePeriods = this.selectedDatePeriods.filter(d => d !== value);
    } else {
      this.selectedDatePeriods = [...this.selectedDatePeriods, value];
    }
    await this.applyDatePeriodFilter();
  }

  async toggleDepartmentDetailValue(value: string): Promise<void> {
    if (value === 'All') {
      this.selectedDepartmentDetail = '';
    } else {
      this.selectedDepartmentDetail = value;
    }
    await this.applyDepartmentDetailFilter();
  }

  async clearDepartmentFilter(): Promise<void> {
    this.selectedDepartment = '';
    this.selectedDepartmentDetail = '';
    await this.applyDepartmentFilter();
  }

  async clearDepartmentDetailFilter(): Promise<void> {
    this.selectedDepartmentDetail = '';
    await this.applyDepartmentDetailFilter();
  }

  async clearDatePeriodFilter(): Promise<void> {
    this.selectedDatePeriods = [];
    await this.applyDatePeriodFilter();
  }

  async applyDepartmentFilter(): Promise<void> {
    const parameterName = this.departmentFilterFieldName;
    const parameterValue = this.selectedDepartment;

    const applyParameterToViz = async (vizId: string) => {
      let viz: any = document.getElementById(vizId);

      if (!viz) {
        const tableauVizElements = document.querySelectorAll('tableau-viz');
        if (tableauVizElements.length > 0) {
          viz = Array.from(tableauVizElements).find(
            v => v.id === vizId || v.getAttribute('id') === vizId
          ) || tableauVizElements[0];
        }
      }

      if (!viz) return;

      if (!viz.workbook) {
        setTimeout(() => applyParameterToViz(vizId), 500);
        return;
      }

      try {
        if (parameterValue && parameterValue !== '') {
          await viz.workbook.changeParameterValueAsync(parameterName, parameterValue);
        }
      } catch (error) {}
    };

    await applyParameterToViz('tableauDashboardViz');
  }

  async applyDepartmentDetailFilter(): Promise<void> {
    const parameterName = this.selectedDepartmentDetailFieldName;
    const parameterValue = this.selectedDepartmentDetail;

    const applyParameterToViz = async (vizId: string) => {
      let viz: any = document.getElementById(vizId);

      if (!viz) {
        const tableauVizElements = document.querySelectorAll('tableau-viz');
        if (tableauVizElements.length > 0) {
          viz = Array.from(tableauVizElements).find(
            v => v.id === vizId || v.getAttribute('id') === vizId
          ) || tableauVizElements[0];
        }
      }

      if (!viz) return;

      if (!viz.workbook) {
        setTimeout(() => applyParameterToViz(vizId), 500);
        return;
      }

      try {
        if (parameterValue && parameterValue !== '') {
          await viz.workbook.changeParameterValueAsync(parameterName, parameterValue);
        }
      } catch (error) {}
    };

    await applyParameterToViz('tableauDashboardViz');
  }

  async applyDatePeriodFilter(): Promise<void> {
    const fieldName = this.datePeriodFilterFieldName;
    const filterValues = this.selectedDatePeriods;

    const applyFilterToViz = async (vizId: string) => {
      let viz: any = document.getElementById(vizId);

      if (!viz) {
        const tableauVizElements = document.querySelectorAll('tableau-viz');
        if (tableauVizElements.length > 0) {
          viz = Array.from(tableauVizElements).find(
            v => v.id === vizId || v.getAttribute('id') === vizId
          ) || tableauVizElements[0];
        }
      }

      if (!viz) return;

      if (!viz.workbook) {
        setTimeout(() => applyFilterToViz(vizId), 500);
        return;
      }

      try {
        const activeSheet = viz.workbook.activeSheet;

        if (activeSheet.sheetType === 'dashboard') {
          const worksheets = activeSheet.worksheets;

          for (const worksheet of worksheets) {
            try {
              if (filterValues.length === 0) {
                await worksheet.clearFilterAsync(fieldName);
              } else {
                await worksheet.applyFilterAsync(fieldName, filterValues, 'replace');
              }
            } catch (error) {}
          }
        } else {
          if (filterValues.length === 0) {
            await activeSheet.clearFilterAsync(fieldName);
          } else {
            await activeSheet.applyFilterAsync(fieldName, filterValues, 'replace');
          }
        }
      } catch (error) {}
    };

    await applyFilterToViz('tableauDashboardViz');
  }

  toggleFilterPanel(): void {
    this.isFilterPanelOpen = !this.isFilterPanelOpen;
  }

  openDepartmentFilter(): void {
    this.showDepartmentFilter = true;
  }

  closeDepartmentFilter(): void {
    this.showDepartmentFilter = false;
  }

  openSelectedDepartmentFilter(): void {
    this.showSelectedDepartmentFilter = true;
  }

  closeSelectedDepartmentFilter(): void {
    this.showSelectedDepartmentFilter = false;
  }

  openDatePeriodFilter(): void {
    this.showDatePeriodFilter = true;
  }

  closeDatePeriodFilter(): void {
    this.showDatePeriodFilter = false;
  }
}
