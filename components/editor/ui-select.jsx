import React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@radix-ui/react-icons';

export const BeSelect = React.forwardRef(
  ({ children, ...props }, forwardedRef) => {
    return (
      <SelectPrimitive.Root {...props}>
        <SelectPrimitive.Trigger className={'SelectTrigger'}  ref={forwardedRef}>
          <SelectPrimitive.Value />
          <SelectPrimitive.Icon className="SelectIcon">
            <ChevronDownIcon />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal className="SelectViewport">
          <SelectPrimitive.Content>
            <SelectPrimitive.ScrollUpButton className="SelectScrollButton">
              <ChevronUpIcon />
            </SelectPrimitive.ScrollUpButton>
            <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
            <SelectPrimitive.ScrollDownButton className="SelectScrollButton">
              <ChevronDownIcon />
            </SelectPrimitive.ScrollDownButton>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    );
  }
);

export const BeSelectItem = React.forwardRef(
  ({ children, ...props }, forwardedRef) => {
    return (
      <SelectPrimitive.Item {...props} className={'SelectItem'} ref={forwardedRef}>
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        <SelectPrimitive.ItemIndicator>
          <CheckIcon />
        </SelectPrimitive.ItemIndicator>
      </SelectPrimitive.Item>
    );
  }
);
