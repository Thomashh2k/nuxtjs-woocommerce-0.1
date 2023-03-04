import { useAuth } from "@/store/useAuth";
import LOGIN_USER_MUTATION from "@/apollo/mutations/LOGIN_USER_MUTATION.gql";

export function login (payload) {

    debugger
    const authStore = useAuth();

    const loginVariables = { input: payload };
    const { mutate, onDone} = useMutation(LOGIN_USER_MUTATION, { variables: loginVariables });
    mutate(payload);
    const result = onDone((result) => {
      debugger
      authStore.setToken(result.data.login.authToken)
      authStore.setUser(result.data.login.user)
    })

    return result
};
