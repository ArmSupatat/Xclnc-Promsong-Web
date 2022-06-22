import axios from '~/plugins/axios'

class GetLookUpMPTShipRouteDelivery {
  async getLookUpMPTShipRouteDelivery(
    shipRouteId: number,
    global: string,
    channelName: string
  ) {
    return await axios
      .post(
        `/LookUp/GetLookUpMPTShipRouteDelivery?ShipRouteId=${shipRouteId}`,
        null,
        {
          headers: {
            global,
            channelName,
          },
        }
      )
      .then((response) => response.data)
      .catch((err) => console.log(err))
  }
}
export const getLookUpMPTShipRouteDelivery = new GetLookUpMPTShipRouteDelivery()
