'use client';
import dynamic from 'next/dynamic';

const DynamicAlertStack = dynamic(() => import('@/shared/ui/Alert/AlertStack'), { ssr: false });

export default DynamicAlertStack;
