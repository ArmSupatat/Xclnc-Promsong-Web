import axios from '~/plugins/axios'
import { CommandPurchaseOrderInput } from '~/types/CommandPurchaseOrderInput'
class CommandPurchaseOrder {
  async commandPurchaseOrder(
    cmdPO: CommandPurchaseOrderInput,
    global: string,
    channelName: string
  ) {
    return await axios
      .post(`/Order/CommandPurchaseOrder`, cmdPO, {
        headers: {
          global,
          channelName,
        },
      })
      .then((response) => response.data)
      .catch((err) => console.log(err))
  }
}
export const cmdPO = new CommandPurchaseOrder()
