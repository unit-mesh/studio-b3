/**
 * based on:
 * https://github.com/ueberdosis/tiptap/issues/1508
 * MIT License https://github.com/fantasticit/think/blob/main/packages/client/src/tiptap/core/extensions/slash.ts#L11
 * https://github.com/fantasticit/magic-editor/blob/main/src/extensions/slash/slash-menu-view.tsx#L68
 */
import React, { ElementRef, RefObject } from "react";
import i18next from "i18next";

class SlashView extends React.Component<
  { items: any; command: any },
  { selectedIndex: number }
> {
  $container: RefObject<any>;

  constructor(props: { items: any; command: any }) {
    super(props);
    this.$container = React.createRef();
    this.state = {
      selectedIndex: 0,
    };
  }

  selectItem = (index: number) => {
    const { items, command } = this.props;
    const selectedCommand = items[index];

    if (selectedCommand) {
      command(selectedCommand);
    }
  };

  upHandler = () => {
    const { items } = this.props;
    this.setState((prevState: { selectedIndex: number }) => ({
      selectedIndex:
        (prevState.selectedIndex + items.length - 1) % items.length,
    }));
  };

  downHandler = () => {
    const { items } = this.props;
    this.setState((prevState: { selectedIndex: number }) => ({
      selectedIndex: (prevState.selectedIndex + 1) % items.length,
    }));
  };

  enterHandler = () => {
    this.selectItem(this.state.selectedIndex);
  };

  componentDidMount() {
    this.setState({ selectedIndex: 0 });
  }

  componentDidUpdate(prevProps: { items: any }) {
    if (prevProps.items !== this.props.items) {
      this.setState({ selectedIndex: 0 });
    }

    const { selectedIndex } = this.state;
    if (!Number.isNaN(selectedIndex + 1)) {
      const el = this.$container?.current?.querySelector(
        `.slash-menu-item:nth-of-type(${selectedIndex + 1})`,
      );
      el && el.scrollIntoView({ behavior: "smooth", scrollMode: "if-needed" });
    }
  }

  onKeyDown = ({ event }: { event: KeyboardEvent }) => {
    if (event.key === "ArrowUp") {
      this.upHandler();
      return true;
    }

    if (event.key === "ArrowDown") {
      this.downHandler();
      return true;
    }

    if (event.key === "Enter") {
      this.enterHandler();
      return true;
    }

    return false;
  };

  render() {
    const { items } = this.props;
    const { selectedIndex } = this.state;

    return (
      <div className="DropdownMenuContent">
        {items.map(({ name, i18Name }: any, idx: number) => (
          <li
            key={idx}
            onClick={() => this.selectItem(idx)}
            className={
              selectedIndex === idx
                ? "is-active DropdownMenuItem"
                : "DropdownMenuItem"
            }
          >
            {i18Name ? i18next.t(name) : name}
          </li>
        ))}
      </div>
    );
  }
}

export default SlashView;
