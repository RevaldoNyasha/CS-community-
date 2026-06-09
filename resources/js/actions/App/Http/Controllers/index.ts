import PostController from './PostController'
import DashboardController from './DashboardController'
import LikeController from './LikeController'
import CommentController from './CommentController'
import SuggestionController from './SuggestionController'
import Admin from './Admin'
import Auth from './Auth'
import Settings from './Settings'
const Controllers = {
    PostController: Object.assign(PostController, PostController),
DashboardController: Object.assign(DashboardController, DashboardController),
LikeController: Object.assign(LikeController, LikeController),
CommentController: Object.assign(CommentController, CommentController),
SuggestionController: Object.assign(SuggestionController, SuggestionController),
Admin: Object.assign(Admin, Admin),
Auth: Object.assign(Auth, Auth),
Settings: Object.assign(Settings, Settings),
}

export default Controllers