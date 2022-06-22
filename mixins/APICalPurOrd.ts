import Vue from 'vue'
import { mapState } from 'vuex'
import { calculatePurOrd } from '~/api/Order/CalculatePurOrd'
import { cmdGrp3PO } from '~/api/Order/Command29101Group3'
import { AuthModel } from '~/types/AuthModel'
import { CalPurOrdInput, CommandGroup3TPurOrd } from '~/types/CalPurOrdInput'

export default Vue.extend({
  data() {
    return {
      sumPoBeforeDiscAmt: 0 as number,
      sumPoDiscAmt: 0 as number,
      discAmt: 0 as number,
      vatAmt: 0 as number,
      poAmt: 0 as number,
      advPoPct: 0 as number,
      advPoAmt: 0 as number,
      apAdvNoInvBfAmt: 0 as number,
      genQrAmt: 0 as number,
      cart: [] as object[],
      tPurOrd: null as any,
      tPurOrdCmdGrp3: null as any,
    }
  },
  methods: {
    async calculatePrice() {
      try {
        const cmdGrp3PORes = await cmdGrp3PO.command29101Group3(
          0,
          {
            poId: this.poId,
          },
          this.auth.globalCode,
          this.auth.channelName
        )
        const { alert } =
          cmdGrp3PORes && cmdGrp3PORes.data ? cmdGrp3PORes.data : null
        if (alert && alert.length > 0) {
          if (alert[0].alertId === -1) {
            const cmdGrp3TPurOrd: CommandGroup3TPurOrd[] =
              cmdGrp3PORes.data.tPurOrd
            this.tPurOrdCmdGrp3 = cmdGrp3TPurOrd
            const cmdGrp3Req: CalPurOrdInput = {
              cmdGrp3: {
                tPurOrd: cmdGrp3TPurOrd,
              },
            }
            const calculatePurOrdRes = await calculatePurOrd.calculatePurOrd(
              cmdGrp3Req,
              this.auth.globalCode,
              this.auth.channelName
            )
            const { tPurOrd } =
              calculatePurOrdRes &&
              calculatePurOrdRes.data &&
              calculatePurOrdRes.data.cmdGrp3
                ? calculatePurOrdRes.data.cmdGrp3
                : null
            if (tPurOrd) {
              this.tPurOrd = tPurOrd
              //รวมเป็นเงิน
              this.sumPoBeforeDiscAmt = tPurOrd.sumPoBeforeDiscAmt
              //ส่วนลดสินค้า
              this.sumPoDiscAmt = tPurOrd.sumPoDiscAmt
              //ส่วนลด
              this.discAmt = tPurOrd.discAmt
              //ภาษีมูลค่าเพิ่ม
              this.vatAmt = tPurOrd.vatAmt
              //รวมทั้งสิ้น
              this.poAmt = tPurOrd.poAmt
              //เงินมัดจำ %
              this.advPoPct = tPurOrd.advPoPct
              //เงินมัดจำ
              this.advPoAmt = tPurOrd.advPoAmt
              //เงินชำระล่วงหน้าคงเหลือ
              this.apAdvNoInvBfAmt = tPurOrd.apAdvNoInvBfAmt
              //ยอดเงินชำระ
              this.genQrAmt = tPurOrd.genQrAmt
            }
          } else {
            console.log(alert)
          }
        } else {
          console.log(alert)
        }
      } catch (err) {
        console.log(err)
      }
    },
  },
  computed: {
    ...mapState({
      poId: (state: any) => state.cartStore.poId,
      auth: (state: any): AuthModel => state.authStore.auth,
    }),
  },
})
