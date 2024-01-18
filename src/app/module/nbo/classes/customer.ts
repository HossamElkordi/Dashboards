import { Product } from "./product"

export class Customer {
    ID: number = 0
    Name: string = ""
    Age: number = 0
    Account_age: number = 0
    Products: string[] = []
    Products_types: string[] = []
    Best_product: Product | undefined;
    All_products: Product[] = []
    constructor(id: number, name: string, age: number, acc_age: number
        , Products: string[], Products_types: string[], All_products: Product[] = []) {
        this.Name = name;
        this.ID = id;
        this.Age = age;
        this.Account_age = acc_age;
        this.Products = Products;
        this.Products_types = Products_types;
        this.All_products = All_products;
    }
    
    get_all_products() {
        return this.All_products.map(product => product.Name);
    }
    get_all_probabilities() {
        return this.All_products.map(product => product.Probability);
    }
    get_all_gain() {
        return this.All_products.map(product => product.Gain);
    }
    get_all_impact() {
        return this.All_products.map(product => product.Indirect_impact + product.Direct_impact);
    }
    get_all_direct_impact() {
        return this.All_products.map(product => product.Direct_impact);
    }
    get_all_indirect_impact() {
        return this.All_products.map(product => product.Indirect_impact);
    }
    randomize_products() {

    }
    get_max() {
        let max = this.All_products.reduce((max, game) => max.Probability > game.Probability ? max : game);
        this.Best_product = max
    }

}
