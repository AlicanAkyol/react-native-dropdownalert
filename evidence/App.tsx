import React, {useEffect, useRef, useState} from 'react';
import {Platform, StatusBar, Text, View} from 'react-native';
import Before, {DropdownAlertData as BeforeData} from './dropdownBefore/DropdownAlert';
import After, {DropdownAlertData as AfterData} from './dropdownAfter/DropdownAlert';

export default function App() {
  const before = useRef<(data?: BeforeData) => Promise<BeforeData>>(async () => ({}));
  const after = useRef<(data?: AfterData) => Promise<AfterData>>(async () => ({}));
  const [baseline, setBaseline] = useState('not started');
  const [patched, setPatched] = useState('not started');
  const [error, setError] = useState('none');
  useEffect(() => {
    const hermes = (globalThis as any).HermesInternal;
    hermes?.enablePromiseRejectionTracker?.({
      allRejections: true,
      onUnhandled: (_id: number, reason: unknown) => setError(String(reason)),
      onHandled: () => {},
    });
    const task = setTimeout(() => {
      setBaseline('pending');
      setPatched('pending');
      before.current({type: 'info', title: 'Before', message: 'Baseline notice', interval: 1000})
        .then(() => setBaseline('resolved'));
      after.current({type: 'info', title: 'After', message: 'Notice opens and resolves', interval: 1000})
        .then(() => setPatched('resolved'));
    }, 1000);
    return () => clearTimeout(task);
  }, []);
  const bar = StatusBar as any;
  return (
    <View style={{flex: 1, backgroundColor: 'white', paddingHorizontal: 20, paddingTop: 100}}>
      <Text style={{fontSize: 23, fontWeight: '700'}}>DropdownAlert · RN 0.87.1</Text>
      <Text style={{fontSize: 17, marginTop: 12}}>Android API {Platform.Version} · Hermes</Text>
      <Text style={{fontSize: 15, marginTop: 24}}>setBackgroundColor: {typeof bar.setBackgroundColor}</Text>
      <Text style={{fontSize: 15}}>setTranslucent: {typeof bar.setTranslucent}</Text>
      <Text style={{fontSize: 20, marginTop: 36}}>Before promise: {baseline}</Text>
      <Text style={{fontSize: 20, marginTop: 16}}>After promise: {patched}</Text>
      <Text style={{fontSize: 15, marginTop: 30}}>Recorded unhandled rejection:</Text>
      <Text style={{fontSize: 15, color: '#a00', marginTop: 8}}>{error}</Text>
      <Before alert={fn => (before.current = fn)} />
      <After alert={fn => (after.current = fn)} />
    </View>
  );
}
