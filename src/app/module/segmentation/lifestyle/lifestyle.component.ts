import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, tap } from 'rxjs';
import {
  Column,
  LifestyleClient,
  checkbox_list_items,
} from 'src/app/interfaces/types';
import { SegmentationServiceService } from 'src/app/services/segmentation-service.service';

@Component({
  selector: 'app-lifestyle',
  templateUrl: './lifestyle.component.html',
  styleUrls: ['./lifestyle.component.css'],
})
export class LifestyleComponent {
  constructor(private service: SegmentationServiceService) {}

  @Input() set state(newState: checkbox_list_items[]) {
    for (const item of newState) {
      if (this.displayedCards.includes(item.name) && !item.checked) {
        this.displayedCards = this.displayedCards.filter(
          (card) => card !== item.name
        );
      } else if (!this.displayedCards.includes(item.name) && item.checked) {
        this.displayedCards = [item.name, ...this.displayedCards];
      }
    }
  }
  selectedClient: LifestyleClient | null = null;

  columns: Column[] = [
    { name: 'Customer Name', value: 'Person', type: 'text' },
    { name: 'Gender', value: 'Gender', type: 'text' },
    { name: 'Yearly Income', value: 'Yearly_Income_segment', type: 'text' },
    { name: 'FICO Score', value: 'FICO_Score', type: 'text' },
    { name: 'Car Behavior', value: 'Car_Behavior', type: 'text' },
    { name: 'Travelling Behavior', value: 'travelling_behavior', type: 'text' },
    { name: 'Number of Travels', value: 'Num_Of_Travels', type: 'text' },
  ];
  tableData!: MatTableDataSource<LifestyleClient>;

  cardsDict = {
    customerInfo: 'customerInfo',
    carBehavior: 'carBehavior',
    travelBehavior: 'travelBehavior',
  };
  emptyCardsInfo: {
    [index: string]: { title: string; info: { name: string; value: string }[] };
  } = {
    [this.cardsDict.customerInfo]: {
      title: 'Customer Info',
      info: [
        { name: 'Customer Name', value: '' },
        { name: 'Gender', value: '' },
        { name: 'Yearly Income', value: '' },
        { name: 'City', value: '' },
      ],
    },
    [this.cardsDict.carBehavior]: {
      title: 'Car Behavior',
      info: [
        { name: 'Car Rental', value: '' },
        { name: 'Car Services', value: '' },
        { name: 'Gas', value: '' },
        { name: 'Road Fees', value: '' },
        { name: 'Transportation', value: '' },
        { name: 'Car Behavior', value: '' },
      ],
    },
    [this.cardsDict.travelBehavior]: {
      title: 'Travelling Behavior',
      info: [
        { name: 'Air Transportation', value: '' },
        { name: 'Airlines', value: '' },
        { name: 'Hotel Reservation', value: '' },
        { name: 'Travel', value: '' },
        { name: 'Cruise Lines', value: '' },
        { name: 'Travelling Behavior', value: '' },
      ],
    },
  };
  cardsInfo = { ...this.emptyCardsInfo };
  displayedCards: string[] = [];

  data$!: Observable<LifestyleClient>;

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.service.lifestyleInfo().subscribe((data) => {
      this.tableData = new MatTableDataSource(data);
    });
  }

  selectClient(client: LifestyleClient | null) {
    if (client === null) {
      this.cardsInfo = { ...this.emptyCardsInfo };
    } else {
      this.data$ = this.service.lifeStyleClientDetails(client.User).pipe(
        tap((data) => {
          this.cardsInfo = {
            [this.cardsDict.customerInfo]: {
              title: 'Customer Info',
              info: [
                { name: 'Customer Name', value: data.Person },
                { name: 'Gender', value: data.Gender },
                { name: 'Yearly Income', value: data.Yearly_Income_segment },
                { name: 'City', value: data.City },
              ],
            },
            [this.cardsDict.carBehavior]: {
              title: 'Car Behavior',
              info: [
                { name: 'Car Rental', value: data.Car_Rental },
                { name: 'Car Services', value: data.Car_services },
                { name: 'Gas', value: data.Gas },
                { name: 'Road Fees', value: data.Road_Fees },
                { name: 'Transportation', value: data.Transportation },
                { name: 'Car Behavior', value: data.Car_Behavior },
              ],
            },
            [this.cardsDict.travelBehavior]: {
              title: 'Travelling Behavior',
              info: [
                { name: 'Air Transportation', value: data.Air_transportation },
                { name: 'Airlines', value: data.Airlines },
                { name: 'Hotel Reservation', value: data.Hotel_Reservation },
                { name: 'Travel', value: data.Travel },
                { name: 'Cruise Lines', value: data.Cruise_Lines },
                {
                  name: 'Travelling Behavior',
                  value: data.travelling_behavior,
                },
              ],
            },
          };
        })
      );
    }
  }
}
