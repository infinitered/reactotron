import Reactotron, { trackGlobalErrors } from 'reactotron-react-js';
import { reactotronRedux } from 'reactotron-redux';
import sagaPlugin from 'reactotron-redux-saga';

Reactotron
  .configure()
  .use(trackGlobalErrors())
  .use(reactotronRedux())
  .use(sagaPlugin())
  .connect();
