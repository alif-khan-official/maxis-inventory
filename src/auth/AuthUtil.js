class AuthUtil {

	setUserDetails(detail) {
		localStorage.setItem("userdetail", JSON.stringify(detail));
	}

	getUserDetails() {
		let detail = JSON.parse(localStorage.getItem("userdetail"));
		return detail;
	}

	setUserId(userId) {
		localStorage.setItem("userId", userId);
	}

	setUsername(username) {
		localStorage.setItem("username", username);
	}

	getUsername() {
		let username = localStorage.getItem("username");
		return username;
	}

	getUserId() {
		let userId = localStorage.getItem("userId");
		return userId;
	}

	setTanentId(tanentId) {
		localStorage.setItem("tanentId", tanentId);
	}

	getTanentId() {
		let tanentId = localStorage.getItem("tanentId");
		return tanentId;
	}

	setTokenDetail(tokenDetail) {
		localStorage.setItem("id_token", tokenDetail.id_token);
		localStorage.setItem("refresh_token", tokenDetail.refresh_token);
		localStorage.setItem("expires_in", tokenDetail.expires_in);
		localStorage.setItem("role_list", JSON.stringify(tokenDetail.roleList));
	}
	setRole(roleList) {
		localStorage.setItem("role_list", JSON.stringify(roleList));
	}
	setMenu(menu) {
		localStorage.setItem("menu", JSON.stringify(menu));
	}

	getIdToken() {
		let id_token = "";
		try {
			id_token = localStorage.getItem("id_token");
			return id_token;

		} catch (e) {
			localStorage.setItem("id_token", "");
			return id_token;
		}
	}

	getRoleList() {
		let roleList = [];
		try {
			roleList = localStorage.getItem("role_list");
			return JSON.parse(roleList);

		} catch (e) {
			localStorage.setItem("role_list", "");
			return roleList;
		}
	}

	getRole(i) {
		let roleListString = [];
		let roleList = [];
		try {
			roleListString = localStorage.getItem("role_list");
			roleList = JSON.parse(roleListString);
			return roleList[i];
		} catch (e) {
			localStorage.setItem("role_list", "");
			return roleList;
		}
	}

	getRefreshToken() {
		let refresh_token = localStorage.getItem("refresh_token");
		return refresh_token;
	}

	getExpireTime() {
		let expires_in = localStorage.getItem("expires_in");
		return expires_in;
	}

	getMenu() {
		let menu = "";
		try {
			menu = localStorage.getItem("menu");
			return JSON.parse(menu);

		} catch (e) {
			localStorage.setItem("menu", "");
			return menu;
		}
	}
	isTokenValid() {
		let id_token = this.getIdToken();

		if (id_token === null || id_token === undefined) {
			return false;
		}

		return true;
	}

	resetTokenDetail() {
		localStorage.clear();
	}
}

export default new AuthUtil();