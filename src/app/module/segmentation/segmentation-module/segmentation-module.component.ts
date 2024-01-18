import { Component } from '@angular/core';
import { checkbox_list_items } from 'src/app/interfaces/types';

@Component({
  selector: 'app-segmentation-module',
  templateUrl: './segmentation-module.component.html',
  styleUrls: ['./segmentation-module.component.css'],
})
export class SegmentationModuleComponent {
  constructor() {}

  selected = 'demoSeg';

  segmentationTabsDict = {
    demoSeg: 'demoSeg',
    lifecycle: 'lifecycle',
    spendingBehavior: 'spendingBehavior',
    clientsDist: 'clientsDist',
    lifestyle: 'lifestyle',
  };

  segmentationTabs = Object.values(this.segmentationTabsDict);

  segmentationTabsInfo: {
    [index: string]: {
      title: string;
      charts: checkbox_list_items[];
      selected: boolean;
    };
  } = {
    [this.segmentationTabsDict.demoSeg]: {
      title: 'Demographic Segmentation',
      charts: [
        { name: 'ageSeg', title: 'Age Segment', checked: true },
        { name: 'eduLevel', title: 'Education Level', checked: true },
        { name: 'kidsCount', title: 'Number of Kids', checked: false },
        { name: 'income', title: 'Yearly Income', checked: false },
        { name: 'demoSeg', title: 'Demographic Segment', checked: false },
        { name: 'genderDist', title: 'Gender Distribution', checked: false },
      ],
      selected: true,
    },
    [this.segmentationTabsDict.lifecycle]: {
      title: 'Segment Life Cycle',
      charts: [
        { name: 'current', title: 'Current Segment', checked: true },
        { name: 'batch0', title: 'Batch 0 Segment', checked: true },
        { name: 'batch1', title: 'Batch 1 Segment', checked: false },
        { name: 'batch2', title: 'Batch 2 Segment', checked: false },
        { name: 'batch3', title: 'Batch 3 Segment', checked: false },
        { name: 'batch4', title: 'Batch 4 Segment', checked: false },
        { name: 'batch5', title: 'Batch 5 Segment', checked: false },
      ],
      selected: false,
    },
    [this.segmentationTabsDict.spendingBehavior]: {
      title: 'Spending Behavior',
      charts: [
        { name: 'eduLevel', title: 'Education Level', checked: true },
        { name: 'ageSeg', title: 'Age Segment', checked: true },
        { name: 'kidsCount', title: 'Number of Kids', checked: false },
        { name: 'valSeg', title: 'Value-Based Segmentation', checked: false },
        { name: 'demoSeg', title: 'Demographic Segment', checked: false },
        { name: 'clientsDist', title: 'Clients Distribution', checked: false },
      ],
      selected: false,
    },
    [this.segmentationTabsDict.clientsDist]: {
      title: 'Clients Distribution',
      charts: [
        { name: 'clientsDist', title: 'Clients Distribution', checked: true },
      ],
      selected: false,
    },
    [this.segmentationTabsDict.lifestyle]: {
      title: 'Lifestyle',
      charts: [
        { name: 'carBehavior', title: 'Car Behavior', checked: true },
        { name: 'travelBehavior', title: 'Travel Behavior', checked: true },
      ],
      selected: false,
    },
  };

  changeState(tab: string, newTabState: checkbox_list_items[]) {
    this.segmentationTabsInfo[tab].charts = [...newTabState];
  }
}
