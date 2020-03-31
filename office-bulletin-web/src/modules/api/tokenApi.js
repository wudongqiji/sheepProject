class TokenApi {

	static GetToken() {
		const parseStorage = JSON.parse(localStorage.u);
		if(parseStorage.token){
			return `${parseStorage.token.tokenType} ${parseStorage.token.accessToken}`;
		}else{
			return ``;
		}
	}

}

export default TokenApi;
