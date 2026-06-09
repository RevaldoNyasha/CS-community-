import GithubAuthController from './GithubAuthController'
import GoogleAuthController from './GoogleAuthController'
const Auth = {
    GithubAuthController: Object.assign(GithubAuthController, GithubAuthController),
GoogleAuthController: Object.assign(GoogleAuthController, GoogleAuthController),
}

export default Auth