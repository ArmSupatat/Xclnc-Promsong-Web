import axios from '~/plugins/axios'

class LocationLatlng {
  async GetAddrByLatLong(Latitude: string, Longtitude: string) {
    return await axios
      .post(`/Location/GetAddrByLatLong`, {
        Latitude,
        Longtitude,
      })
      .then((response) => response.data)
      .catch((err) => console.log(err))
  }
}
export const locLatlng = new LocationLatlng()
