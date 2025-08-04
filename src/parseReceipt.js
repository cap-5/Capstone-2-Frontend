/* This function accepts a string receiptText, representing the text in a receipt, and returns 
an Array of Objects containing the name and price of each receipt item. For example, given the
receiptText:

OCR Result:

Address Here

Table - 06
Check #: 71842 Pax(s): 01
Date 08/03/2025 16:56
Cashier: ESPN Thompson
3 TtemNemedi 15.00
2 Item Name 2 20.00
1 Item Name 3 15.00
Swtotal © 50.00

Total 50.00

The return result should be:
[
    {name: "3 TtemNemedi", price: 15.00 },
    {name: "2 Item Name 2", price: 20.00 },
    {name: "1 Item Name 3", price: 15.00 },
]
*/

// const receiptText = `OCR Result:

// Address Here

// Table - 06
// Check #: 71842 Pax(s): 01
// Date 08/03/2025 16:56
// Cashier: ESPN Thompson
// 3 TtemNemedi 15.00
// 2 Item Name 2 20.00
// 1 Item Name 3 15.00
// Swtotal © 50.00

// Total 50.00`;

export default function parseReceipt(receiptText) {
  const regexp = /\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})/g;
  const matches = receiptText.matchAll(regexp);
  let start = 0;
  let items = [];

  for (const match of matches) {
    //   console.log(
    //     `Found ${match[0]} start=${match.index} end=${
    //       match.index + match[0].length
    //     }.`
    //   );
    let item = {};
    const price = match[0];
    const splitOnNewLine = receiptText
      .substring(start, match.index)
      .split(/\n/);
    const name = splitOnNewLine[splitOnNewLine.length - 1].trim();
    start = match.index + match[0].length;
    item.name = name;
    item.price = price;
    items.push(item);
  }
  return(items)
}

// parseReceipt(receiptText);