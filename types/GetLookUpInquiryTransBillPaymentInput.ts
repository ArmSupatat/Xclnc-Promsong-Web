export interface GetLookUpInquiryTransBillPaymentInput {
  biller: string
  amount: number
  reference1: string
  reference2: string
  terminal: string
  isSummary: boolean
  dateFrom: string
  dateTo: string
}
