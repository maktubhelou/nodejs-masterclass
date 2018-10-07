const menu = {
  categories: ["pizza", "sides", "drinks"],
  pizzas: [
    {
      item: "Pepperoni",
      toppings: ["cheese", "pepperoni"],
      price: { sm: 8.99, med: 10.99, lg: 12.99 }
    },
    {
      item: "Margarita",
      toppings: ["cheese", "basil"],
      price: { sm: 7.99, med: 9.99, lg: 11.99 }
    },
    {
      item: "Meat Lovers",
      toppings: ["cheese"],
      price: { sm: 9.99, med: 11.99, lg: 13.99 }
    },
    {
      item: "BBQ",
      toppings: ["cheese", "BBQ Pork", "Pineapple"],
      price: { sm: 9.99, med: 11.99, lg: 13.99 }
    },
    {
      item: "Hawaiian",
      toppings: ["cheese", "ham", "pineapple"],
      price: { sm: 8.99, med: 10.99, lg: 11.99 }
    },
    {
      item: "Vegetarian",
      toppings: ["cheese", "green pepper", "mushrooms"],
      price: { sm: 9.99, med: 11.99, lg: 13.99 }
    },
    {
      item: "Seafood",
      toppings: ["cheese", "shrimp", "squid"],
      price: { sm: 10.99, med: 12.99, lg: 14.99 }
    }
  ],
  sides: [
    { item: "French Fries", price: 1.99 },
    { item: "Fried Chicken", price: 4.99 },
    { item: "Garlic Bread", price: 1.99 },
    { item: "Garden Salad", price: 4.99 },
    { item: "Caesar Salad", price: 6.99 }
  ],
  drinks: [
    { item: "Coca Cola", price: 1.99 },
    { item: "Sprite", price: 1.99 },
    { item: "Fanta", price: 1.99 },
    { item: "Beer", price: 1.99 },
    { item: "Water", price: 0.99 }
  ]
};

module.exports = menu;
