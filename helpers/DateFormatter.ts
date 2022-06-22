export default {
  generalDateFormat: (moment: any, dateTime: Date) => {
    return moment(dateTime).locale('th').format('DD/MM/YYYY')
  },
  shortDateFormat: (moment: any, dateTime: string) => {
    return moment(new Date(dateTime)).locale('th').format('DD/MM/YY')
  },
  timeFormat: (moment: any, dateTime: string) => {
    return moment(new Date(dateTime)).locale('th').format('HH:mm')
  },
  toBuddhistYear: (moment: any, format: string) => {
    var christianYear = moment.format('YY')
    var buddhishYear = (parseInt(christianYear) + 543).toString()
    return moment
      .format(format.replace('YY', buddhishYear.substring(3, 4)))
      .replace(christianYear, buddhishYear)
  },
}
