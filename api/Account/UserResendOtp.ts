import axios from "~/plugins/axios"

class ResendOtp {
	async userResendOtp(
		registerId: string,
		hashCode: string,
	) {
		return await axios
			.post(
				`/Account/UserResendOtp?RegisterId=${registerId}&HashCode=.`,
				null,
			)

	}

}
export const resendOtp = new ResendOtp()
