'use client';

import fetcher from '@/lib/fetcher';
import { type ApiResponse } from '@/types/apiResponse';
import { type analytics } from '@prisma/client';
import { useMemo } from 'react';
import useSWR from 'swr';

export default function AnalyticsPage() {
  const { data, error } = useSWR<ApiResponse<analytics[]>, string>(
    '/api/analytics',
    fetcher,
  );

  const memoizedData = useMemo(() => {
    if (!data?.data) {
      return [];
    }

    const uniqueAnalytics: analytics[] = [];

    for (const currentAnalytics of data.data) {
      const existingAnalytics = uniqueAnalytics.find(
        (a) => a.name === currentAnalytics.name,
      );

      if (!existingAnalytics) {
        uniqueAnalytics.push(currentAnalytics);
      }
    }

    return (
      uniqueAnalytics.map((item) => {
        return {
          name: item.name,
          picked: data.data.filter((v) => v.name === item.name && v.picked)
            .length,
          notPicked: data.data.filter((v) => v.name === item.name && !v.picked)
            .length,
        };
      }) ?? []
    );
  }, [data?.data]);

  if (error) {
    return <div>Failed to load</div>;
  }

  return (
    <div className="relative mx-auto max-w-5xl overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="bg-gray-100 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Food
            </th>
            <th scope="col" className="px-6 py-3">
              Picked
            </th>
            <th scope="col" className="px-6 py-3">
              Not Picked
            </th>
          </tr>
        </thead>
        <tbody>
          {memoizedData.map((item) => {
            return (
              <tr
                key={item.name}
                className="border-b bg-white hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 hover:dark:bg-gray-600">
                <th
                  scope="row"
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {item.name}
                </th>
                <td className="px-6 py-4">{item.picked}</td>
                <td className="px-6 py-4">{item.notPicked}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
