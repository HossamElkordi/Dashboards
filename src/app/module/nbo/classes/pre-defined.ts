import { Customer } from "./customer";

export interface Tile {
    cols: number;
    rows: number;
    title: string
}

export interface product_table_row {
    ID: number;
    Date: String;
    Product_id: string;
}

export interface Product_customer {
    customer: string;
    prob: number;
    gain: number;
    impact: number;
    product: string;
}

export interface drop_down_list_item {
    item: string;
    checked: boolean;
}

export interface tier_distribution {
    count: number;
    tier: string;
}

export interface prod_mix_distribution {
    count: number;
    product_mix: string;
}

export interface product_rates {
    acceptance_rate: number;
    bought_percentage: number;
    most_denied_percentage: number;
    no_accept_rate: number;
    product: string;
    product_short: string;
    recommend_percentage: number;
}

export interface creation_dates_info {
    avg_age: number;
    customer_count: number;
    date: string;
    max_age: number;
    min_age: number;
}

export class PreDefined {
    customers: Customer[] = [
        new Customer(1000, "Karim Ibrahim", 25, 3, ["Current Account", "Managed Securities", "Bank Loan"],
            ["Unsecured Lending", "Loan"])
        , new Customer(5000, "Mohamed Salah", 28, 2, ["Direct Securities", "Savings Account", "Managed Securities"],
            ["Credit Card", "Loan"]),
        new Customer(6000, "Mohamed Khamis", 41, 5, ["Premium Credit Card", "Managed Securities"],
            ["Credit Card"]),
        new Customer(7000, "Hossam ElKordi", 24, 7, ["Savings Account", "Direct Securities"],
            ["Savings Account", "Unsecured Lending",]),
        new Customer(8000, "Bassam Mattar", 26, 1, ["Premium Credit Card", "Direct Securities", "Managed Securities"],
            ["Loan"])]

    headers = [["Expected Gain", "Expected Impact"], ["Direct Impact", "Indirect Impact", "Total Expected Impact"], ["Probability"], ["Number of Customers"], ["Average Probability"],
    ["Number Of Customers"], ["Max Customer Age", "Min Cutomer Age"], ["Percentage %"], ["count"]]

    customer_tiles: Tile[] = [
        { title: "Customer ID", cols: 4, rows: 1 },
        { title: "Customer Name", cols: 4, rows: 1 },
        { title: "Customer Age", cols: 2, rows: 1 },
        { title: "Subscription Probability by Product", cols: 6, rows: 3 },
        { title: "Account Age", cols: 2, rows: 1 },
        { title: "Products", cols: 4, rows: 1 },
        { title: "Products Types", cols: 4, rows: 1 },
        { title: "Highest Probability Product", cols: 4, rows: 1 },
        { title: "Probability", cols: 2, rows: 1 },
        { title: "Gain", cols: 2, rows: 1 },
        { title: "Impact", cols: 2, rows: 1 },
        { title: "Average of Expected Gain", cols: 8, rows: 3 },
        { title: "Average of Impact", cols: 8, rows: 3 },
        { title: "text", cols: 10, rows: 3 },
        { title: "Top 3 Recommendation by Similarity", cols: 6, rows: 3 },
        { title: "Used Similarity", cols: 6, rows: 3 },
        { title: "Number of Customers by Similarity", cols: 6, rows: 3 },
        { title: "Count By Similarity And Product", cols: 6, rows: 3 },

    ];
    product_tiles: Tile[] = [
        { title: "Product", cols: 2, rows: 1 },
        { title: "Minimum Probability", cols: 4, rows: 1 },
        { title: "Number of customers", cols: 2, rows: 1 },
        { title: "Expected Gain", cols: 2, rows: 1 },
        { title: "Expected Impact", cols: 2, rows: 1 },
        { title: "Number of customers Based on their products", cols: 8, rows: 3 },
        { title: "Customers table", cols: 4, rows: 3 },
        { title: "Number of customers based on Tiers", cols: 4, rows: 3 },
        { title: "Expected Gain and Impact", cols: 4, rows: 3 },
        { title: "Expected Direct and Indirect Impact", cols: 4, rows: 3 },
    ];
    market_tiles: Tile[] = [
        { title: "Product", cols: 2, rows: 1 },
        { title: "Number of Customers", cols: 4, rows: 1 },
        { title: "Prod. Max Mean Prob", cols: 2, rows: 1 },
        { title: "Prod. Max Gain", cols: 2, rows: 1 },
        { title: "Prod. Max Impact", cols: 2, rows: 1 },
        { title: "Average Probability of Products", cols: 8, rows: 3 },
        { title: "Customers table", cols: 4, rows: 3 },
        { title: "Sum of Impact and Gain of Products", cols: 6, rows: 3 },
        { title: "Sum of Impacts of Products", cols: 6, rows: 3 },
    ];
    cross_sell_tiles: Tile[] = [
        { title: "Product", cols: 2, rows: 1 },
        { title: "Number of Customers", cols: 2, rows: 1 },
        { title: "Prod. Max Mean Prob", cols: 2, rows: 1 },
        { title: "Prod. Max Gain", cols: 2, rows: 1 },
        { title: "Prod. Max Impact", cols: 2, rows: 4 },
        { title: "Prod. Max Impact", cols: 2, rows: 4 },
        { title: "Prod. Max Impact", cols: 2, rows: 4 },
        { title: "Prod. Max Impact", cols: 2, rows: 4 },
        { title: "Average Probability of Products", cols: 8, rows: 4 },

    ];
    prod_analysis_tiles: Tile[] = [
        { title: "Most Bought Product", cols: 2, rows: 1 },
        { title: "Most Recommended Product", cols: 2, rows: 1 },
        { title: "Most Accepted Product", cols: 2, rows: 1 },
        { title: "Most Denied Product", cols: 2, rows: 1 },
        { title: "Products' Popularity", cols: 2, rows: 4 },
        { title: "Products' Recommendation", cols: 2, rows: 4 },
        { title: "Products' Acceptence", cols: 2, rows: 4 },
        { title: "Products' Rejection", cols: 2, rows: 4 },
        { title: "Products with Acceptence Rate", cols: 8, rows: 4 },

    ];
    analysis_tiles: Tile[] = [
        { title: "Number of Customers", cols: 2, rows: 1 },
        { title: "Average Age", cols: 2, rows: 1 },
        { title: "Average account age", cols: 2, rows: 1 },
        { title: "Average Products Held", cols: 2, rows: 1 },
        { title: "Average Income", cols: 2, rows: 1 },
        { title: "Past Revenue period", cols: 2, rows: 1 },
        { title: "Number of Products", cols: 2, rows: 1 },
        { title: "Number of Prod. Types", cols: 2, rows: 1 },
        { title: "Number of Prod. Mix", cols: 2, rows: 1 },
        { title: "Number of Types Mix", cols: 2, rows: 1 },
        { title: "Prod. Max Revenue", cols: 2, rows: 1 },
        { title: "Prod. Min Revenue", cols: 2, rows: 1 },
        { title: "Average Probability of Products", cols: 8, rows: 3 },
        { title: "Number of Customers per Tier", cols: 4, rows: 3 },
        { title: "Number Of New Customers Per Date", cols: 6, rows: 3 },
        { title: "Max And Min Age for New Customers", cols: 6, rows: 3 },
    ];


    charts = ["Probability", "Gain-Impact", "Impact"]

    prepare_product_name(name: string): string | null {
        let arr = name.split(" ")
        let result = ""
        for (let i = 0; i < arr.length - 1; i++) {
            result = result + arr[i][0] + "."
        }
        result = (result + arr[arr.length - 1])
        if (result.length > 12) {
            result = result.substring(0, 12)
        }
        return String(result)
    }

}
