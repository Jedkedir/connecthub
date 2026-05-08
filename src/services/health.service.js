import api, { API_ORIGIN } from "@/services/apiClient"
import { endpoints } from "@/services/endpoints"

export const healthService = {
  check() {
    return api
      .get(endpoints.health, { baseURL: API_ORIGIN })
      .then((response) => response.data)
  },
}
