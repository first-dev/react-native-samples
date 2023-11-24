import { DefaultTheme as NavigationDefaultTheme } from "@react-navigation/native";
import { cloneDeep, merge } from "lodash";
import { MD3LightTheme as PaperDefaultTheme } from "react-native-paper";
import type { PartialDeep } from "type-fest";

type CustomTheme = {
  colors: {
    warning: string;
    success: string;
  };
  spacing: {
    screenHorizontalSpacing: number;
    screenVerticalSpacing: number;
    screenBottomSpacing: number;
    borderM: number;
    xs: number;
    s: number;
    m: number;
    l: number;
    xl: number;
  };
};

const myPaperTheme: PartialDeep<typeof PaperDefaultTheme> & CustomTheme = {
  isV3: true,
  colors: {
    primary: "#733EE3",
    secondary: "#0B0B0E",
    tertiary: "#F0F0F1",
    background: "#FFFFFF",
    surface: "#FFFFFF",
    outline: "#E9E9E9",
    surfaceDisabled: "#0B0B0E3D",
    error: "#E83556",
    onSurface: "#0B0B0E",
    onBackground: "#0B0B0E",
    onSecondary: "#ffffff",
    onTertiary: "#0B0B0E",
    warning: "#FF9B3F",
    success: "#3BC673",
  },
  roundness: 12,
  spacing: {
    screenHorizontalSpacing: 16,
    screenVerticalSpacing: 16,
    screenBottomSpacing: 40,
    borderM: 1,
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  fonts: {
    // TODO: setup fonts theme
  },
};
myPaperTheme.colors;
export type DeepRequired<T> = {
  [K in keyof T]: Required<DeepRequired<T[K]>>;
};

// sync the navigation theme with the paper theme
const myNavigationTheme: PartialDeep<typeof NavigationDefaultTheme> = {
  colors: {
    background: myPaperTheme.colors?.background,
    primary: myPaperTheme.colors?.primary,
  },
};

export const paperTheme = merge(cloneDeep(PaperDefaultTheme), myPaperTheme) as any;
export const navigationTheme = merge(cloneDeep(NavigationDefaultTheme), myNavigationTheme);

// override the useTheme function type to use our custom theme
type ThemeOverride = typeof myPaperTheme;
declare module "react-native-paper" {
  function useTheme<T = ThemeOverride>(overrides?: PartialDeep<T>): T;
}
