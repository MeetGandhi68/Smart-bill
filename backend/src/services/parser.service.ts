export const parseInvoiceData = (text: string) => {
  /* INVOICE NUMBER */
  const invoicePatterns = [
    /(?:Bill No|Bill #|Invoice No|Invoice #|Invoice Serial Number|Receipt No|Inv No)[:\s-]*([A-Z0-9-]+)/i,
  ];

  let invoiceNumber = "";

  for (const pattern of invoicePatterns) {
    const match = text.match(pattern);

    if (match && match[1]) {
      invoiceNumber = match[1].trim();
      break;
    }
  }

  /* DATE */
  const datePatterns = [
    /(?:Date|Invoice Date|Bill Date)[:\s-]*([^\n]+)/i,

    /\b\d{2}[\/-]\d{2}[\/-]\d{2,4}\b/,

    /\b\d{4}-\d{2}-\d{2}\b/,
  ];

  let billDate = "";

  for (const pattern of datePatterns) {
    const match = text.match(pattern);

    if (match) {
      billDate = match[1] || match[0];
      break;
    }
  }

  /* TOTAL AMOUNT */
  const totalPatterns = [
    /Grand Total[:\s₹]*([\d,.]+)/i,

    /Total Sales[:\s₹]*([\d,.]+)/i,

    /Net Amount[:\s₹]*([\d,.]+)/i,

    /Balance Due[:\s₹]*([\d,.]+)/i,

    /Total[:\s₹]*([\d,.]+)/i,

    /Amount\s*\(Rs\)[:\s₹]*([\d,.]+)/i,
  ];

  let totalAmount = "";

  for (const pattern of totalPatterns) {
    const match = text.match(pattern);

    if (match && match[1]) {
      totalAmount = match[1].trim();
      break;
    }
  }

  /* GST EXTRACTION */
  let gstAmount = 0;

  const cgstMatch = text.match(/CGST.*?([\d,.]+)/i);

  const sgstMatch = text.match(/SGST.*?([\d,.]+)/i);

  const igstMatch = text.match(/IGST.*?([\d,.]+)/i);

  if (cgstMatch?.[1]) {
    gstAmount += Number(cgstMatch[1].replace(/,/g, ""));
  }

  if (sgstMatch?.[1]) {
    gstAmount += Number(sgstMatch[1].replace(/,/g, ""));
  }

  if (igstMatch?.[1]) {
    gstAmount += Number(igstMatch[1].replace(/,/g, ""));
  }

  /* ITEM EXTRACTION */
  const items: any[] = [];

  const lines = text.split("\n");

  const blockedWords = [
    "subtotal",
    "discount",
    "grand total",
    "paid amount",
    "balance",
    "tax",
    "cgst",
    "sgst",
    "igst",
  ];

  for (const line of lines) {
    const lowerLine = line.toLowerCase();

    const shouldSkip = blockedWords.some((word) => lowerLine.includes(word));

    if (shouldSkip) continue;

    const itemMatch = line.match(/^([A-Za-z\s]+)\s+\d+\s+[\d.,]+\s+([\d.,]+)$/);

    if (itemMatch && itemMatch[1] && itemMatch[2]) {
      const itemName = itemMatch[1].trim();

      const itemPrice = Number(itemMatch[2].replace(/,/g, ""));

      items.push({
        name: itemName,
        price: itemPrice,
      });
    }
  }

  return {
    invoiceNumber,
    billDate,
    totalAmount,
    gstAmount,
    items,
  };
};
