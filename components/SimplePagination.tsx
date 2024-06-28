import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination'
import React from 'react'

const MAX_VISIBLE_PAGES = 3

export const SimplePagination = ({
  className,
  totalCount,
  pageSize,
  currentPage,
  getPageHref,
}: {
  className?: string
  totalCount: number
  pageSize: number
  currentPage: number
  getPageHref: (newPage: number) => React.ComponentProps<typeof PaginationLink>['href']
}) => {
  const totalPages = Math.ceil(totalCount / pageSize)
  const pageNumLimit = Math.floor(MAX_VISIBLE_PAGES / 2)
  const hasPrevPage = currentPage <= 1
  const hasNextpage = currentPage >= totalPages
  const pageNumbers = Array.from(Array(totalPages), (_, index) => index + 1)

  const activePages = pageNumbers.slice(
    Math.max(0, currentPage - 1 - pageNumLimit),
    Math.min(currentPage - 1 + pageNumLimit + 1, pageNumbers.length),
  )

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={getPageHref(currentPage - 1)}
            aria-disabled={hasPrevPage}
            tabIndex={hasPrevPage ? -1 : undefined}
            className={hasPrevPage ? 'pointer-events-none opacity-50' : undefined}
          />
        </PaginationItem>

        {activePages[0] > 1 && <PaginationEllipsis href={getPageHref(1)} aria-label="Go to first page" />}

        {activePages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink href={getPageHref(page)} isActive={page === currentPage}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {activePages[activePages.length - 1] < totalPages && (
          <PaginationEllipsis href={getPageHref(totalPages)} aria-label="Go to last page" />
        )}

        <PaginationItem>
          <PaginationNext
            href={getPageHref(currentPage + 1)}
            aria-disabled={hasNextpage}
            tabIndex={hasNextpage ? -1 : undefined}
            className={hasNextpage ? 'pointer-events-none opacity-50' : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
