export class Product {
    Name: string = ""
    Probability: number = 0
    Gain: number = 0
    Direct_impact: number = 0
    Indirect_impact: number = 0
    Impact:number = 0
    constructor(Name: string, Probability: number ,Gain: number ,Direct_impact: number, Indirect_impact: number ) {
        this.Name = Name;
        this.Probability = Probability;
        this.Gain = Gain;
        this.Direct_impact = Direct_impact;
        this.Indirect_impact = Indirect_impact;
        this.Impact = this.Indirect_impact + this.Direct_impact;
      }
      randomize(){
        this.Probability = randomInRange(0,0.7);
        this.Gain  = randomInRange(-1,1);
        this.Direct_impact  = randomInRange(-1,0.7);
         this.Indirect_impact = randomInRange(-1,0.7)
      }
      
}
function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }
  