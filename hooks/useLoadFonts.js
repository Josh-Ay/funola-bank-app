import { useEffect } from "react";
import * as Font from 'expo-font';
import fonts from '../assets/fonts';

export default function useLoadFonts (updateAppState) {
  /**
   * Loads fonts into the application
   * 
   * @param updateAppState Function to update the ready state of the app
   *  
   */

  const loadFonts = async () => {
    try {

      await Font.loadAsync(fonts);
      updateAppState(true);

    } catch (error) {
      console.warn(error);      
      updateAppState(true);
    }
  }

  useEffect(() => {
    loadFonts() 
  }, [])
  
}