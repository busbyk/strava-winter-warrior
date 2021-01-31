import React from 'react'
import { useTable, useSortBy, useGroupBy } from 'react-table'
import { CSVLink } from 'react-csv'

const individualActivitiesColumns = ['name', 'type']

function formatTableForCSV(rows) {
  return rows.map((row) => row.values)
}

function formatHeadersForCSV(headers) {
  return headers.map((header) => {
    return {
      label: header.Header,
      key: header.id,
    }
  })
}

export default function ReportTable(props) {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Date',
        accessor: 'date',
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Miles',
        accessor: 'miles',
        aggregate: 'sum',
      },
      {
        Header: 'Type',
        accessor: 'type',
      },
    ],
    []
  )

  function toggleAggregatedView(e) {
    const { target } = e

    if (!target.className.includes('is-active')) {
      toggleGroupBy('date')
      setHiddenColumns((oldHiddenColumns) =>
        oldHiddenColumns === individualActivitiesColumns
          ? []
          : individualActivitiesColumns
      )
      toggleTransactionViewButtons(target)
    }
  }

  function toggleTransactionViewButtons(target) {
    const activeClasses = ' is-link is-light is-active'
    const baseClasses = 'button is-small'
    const ids = ['by-day', 'individual']

    const otherId = ids.find((i) => i !== target.id)

    target.className += activeClasses
    document.getElementById(otherId).className = baseClasses
  }

  let { data } = props
  data = React.useMemo(() => data, [data])

  const initialState = React.useMemo(() => {
    return {
      groupBy: ['date'],
      sortBy: [{ id: 'date' }],
      hiddenColumns: individualActivitiesColumns,
    }
  }, [])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    toggleGroupBy,
    setHiddenColumns,
  } = useTable({ columns, data, initialState }, useGroupBy, useSortBy)

  return (
    <div>
      <div className='level mb-3'>
        <div className='level-left'>
          <div className='level-item'>
            <h1 className='is-size-4 has-text-white'>All January Activities</h1>
          </div>
        </div>
        <div className='level-right'>
          <div className='level-item'>
            <div className='level'>
              <div className='level-right'>
                <div className='level-item'>
                  <div className='buttons has-addons'>
                    <button
                      className='button is-small is-link is-light is-active'
                      id='by-day'
                      onClick={toggleAggregatedView}
                    >
                      Group By Day
                    </button>
                    <button
                      className='button is-small'
                      id='individual'
                      onClick={toggleAggregatedView}
                    >
                      Individual Activities
                    </button>
                  </div>
                </div>
                <div className='level-item'>
                  <CSVLink
                    data={formatTableForCSV(rows)}
                    headers={formatHeadersForCSV(headerGroups[0].headers)}
                    filename='activities.csv'
                    className='button is-small'
                  >
                    Download
                  </CSVLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <table
        {...getTableProps()}
        className='table is-bordered is-striped is-narrow is-hoverable is-fullwidth'
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
