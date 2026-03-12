import React, { forwardRef, useCallback } from 'react';
import GorhomBottomSheet, {
  BottomSheetProps as GorhomProps,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetHandle,
  BottomSheetHandleProps,
} from '@gorhom/bottom-sheet';
import { useTheme } from '@/hooks/useTheme';
import { Radius } from '@/constants/spacing';

export interface BottomSheetProps extends Omit<GorhomProps, 'backgroundStyle' | 'handleComponent'> {
  children: React.ReactNode;
  showHandle?: boolean;
  closeOnBackdrop?: boolean;
}

function Handle(props: BottomSheetHandleProps) {
  const theme = useTheme();
  return (
    <BottomSheetHandle
      {...props}
      style={{
        paddingVertical: 10,
        backgroundColor: theme.surface,
        borderTopLeftRadius: Radius.xl,
        borderTopRightRadius: Radius.xl,
      }}
      indicatorStyle={{
        backgroundColor: theme.border,
        width: 48,
        height: 5,
        borderRadius: 3,
      }}
    />
  );
}

export const BottomSheet = forwardRef<GorhomBottomSheet, BottomSheetProps>(
  function BottomSheet({ children, showHandle = true, closeOnBackdrop = true, onClose, ...props }, ref) {
    const theme = useTheme();

    const renderBackdrop = useCallback(
      (p: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...p}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
          pressBehavior={closeOnBackdrop ? 'close' : 'none'}
        />
      ),
      [closeOnBackdrop],
    );

    return (
      <GorhomBottomSheet
        ref={ref}
        backdropComponent={renderBackdrop}
        handleComponent={showHandle ? Handle : null}
        backgroundStyle={{ backgroundColor: theme.surface }}
        enablePanDownToClose
        onClose={onClose}
        {...props}
      >
        {children}
      </GorhomBottomSheet>
    );
  },
);
