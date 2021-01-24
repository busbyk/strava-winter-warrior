import React from 'react'
import { useTable, useSortBy } from 'react-table'
import { CSVLink } from 'react-csv'

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
      },
      {
        Header: 'Type',
        accessor: 'type',
      },
      {
        Header: 'Valid?',
        accessor: 'valid',
        Cell: ({ value }) => value.toString(),
      },
    ],
    []
  )

  let { data } = props
  data = React.useMemo(() => data, [data])

  const initialState = React.useMemo(() => {
    return { sortBy: [{ id: 'date' }] }
  }, [])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data, initialState }, useSortBy)

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
