import axios from '~/plugins/axios'

class GetCompany {
  async getCompany(global: string, channelName: string) {
    return await axios
      .post(`/Company/GetCompany`, null, {
        headers: {
          global,
          channelName,
        },
      })
      .then((response) => response.data)
      .catch((err) => console.log(err))
  }
}
export const getCompany = new GetCompany()
