import * as React from 'react';

import {noop} from '@shopify/javascript-utilities/other';
import {ReactComponent} from '@shopify/react-utilities/types';
import compose from '@shopify/react-compose';

import {WithContextTypes} from '../src/types';
import withContext from '../src/components/withContext';

import Button, {Props as ButtonProps} from '../src/components/Button';
import Popover, {Props as PopoverProps} from '../src/components/Popover';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

interface ToggleStateState {
  active: boolean;
}

interface ToggleStateContext extends ToggleStateState {
  toggleState(): void;
}

interface PlayPopoverProps extends Omit<PopoverProps, 'active' | 'onClose'> {}
type ComposedPlayPopoverProps = WithContextTypes<ToggleStateContext> &
  PlayPopoverProps;

interface PlayToggleButtonProps extends Omit<ButtonProps, 'onClick'> {}
type ComposedPlayToggleButtonProps = WithContextTypes<ToggleStateContext> &
  PlayToggleButtonProps;

export class ToggleState extends React.PureComponent<
  {children: React.ReactNode},
  ToggleStateState
> {
  state: ToggleStateState = {
    active: false,
  };

  get getContext(): ToggleStateContext {
    return {
      active: this.state.active,
      toggleState: this.toggleState,
    };
  }

  render() {
    return (
      <ToggleStateProvider value={this.getContext}>
        {this.props.children}
      </ToggleStateProvider>
    );
  }

  toggleState = () => {
    const {active} = this.state;
    this.setState({active: !active});
  };
}

const {
  Provider: ToggleStateProvider,
  Consumer: ToggleStateConsumer,
} = React.createContext<ToggleStateContext>({
  active: false,
  toggleState: noop,
});

function PlayPopover(props: ComposedPlayPopoverProps) {
  const {
    context: {active, toggleState},
    ...rest
  } = props;

  return <Popover active={active} onClose={toggleState} {...rest} />;
}

export const decoratedPlayPopover = compose<PlayPopoverProps>(
  withContext<PlayPopoverProps, {}, ToggleStateContext>(ToggleStateConsumer),
)(PlayPopover) as ReactComponent<PlayPopoverProps>;

function PlayToggleButton(props: ComposedPlayToggleButtonProps) {
  const {
    context: {toggleState},
    ...rest
  } = props;

  return <Button onClick={toggleState} {...rest} />;
}

export const decoratedPlayToggleButton = compose<PlayToggleButtonProps>(
  withContext<PlayToggleButtonProps, {}, ToggleStateContext>(
    ToggleStateConsumer,
  ),
)(PlayToggleButton) as ReactComponent<PlayToggleButtonProps>;