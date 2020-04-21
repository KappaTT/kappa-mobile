import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { theme } from '@constants';
import Block from '@components/Block';
import Text from '@components/Text';

const EndCapButton: React.FC<{
  label: string;
  direction?: string;
  color?: string;
  disabled?: boolean;
  onPress?(): void;
}> = ({ label, direction = 'right', color = theme.COLORS.PRIMARY, disabled = false, onPress = () => {} }) => {
  const computedOpacity = disabled ? 0.5 : 1;

  return (
    <Block
      style={[
        styles.wrapper,
        direction === 'right'
          ? {
              right: 16
            }
          : direction === 'left'
          ? {
              left: 16
            }
          : {}
      ]}
    >
      <TouchableOpacity style={styles.button} disabled={disabled} onPress={onPress}>
        <Text
          style={[
            styles.text,
            {
              opacity: computedOpacity,
              color
            }
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    </Block>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    height: 42
  },
  button: {
    height: 42,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    fontFamily: 'OpenSans',
    fontSize: 15
  }
});

export default EndCapButton;
