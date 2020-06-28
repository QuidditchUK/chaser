import React from 'react';
import Heading from 'components/heading';
import { RichText } from 'prismic-reactjs';
import get from 'just-safe-get';
import PrismicWrapper from 'components/prismic-wrapper';
import {
  Table,
  TableRow,
  TableHead,
  TableDataBorder,
} from 'components/table';

const TwoColumnTable = (rawData) => {
  const data = {
    title: get(rawData, 'primary.title'),
    columnOneTitle: get(rawData, 'primary.column_one_title'),
    columnTwoTitle: get(rawData, 'primary.column_two_title'),
    variant: get(rawData, 'primary.variant'),
    items: get(rawData, 'items'),
  };

  return (
    <PrismicWrapper variant={data.variant} small>
      {RichText.asText(data.title) && (
        <Heading as="h2" fontSize={[3, 3, 4]} mt={2}>
          {RichText.asText(data.title)}
        </Heading>
      )}

      <Table fontSize={2}>
        <thead>
          <TableRow>
            <TableHead>{RichText.asText(data.columnOneTitle)}</TableHead>
            <TableHead>{RichText.asText(data.columnTwoTitle)}</TableHead>
          </TableRow>
        </thead>

        <tbody>
          {data.items.map((item, i) => (
            <TableRow key={`${data.columnOneTitle}_${data.columnTwoTitle}_${i}`}>
              <TableDataBorder>{RichText.asText(item.column_one)}</TableDataBorder>
              <TableDataBorder>{RichText.asText(item.column_two)}</TableDataBorder>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </PrismicWrapper>
  );
};

export default TwoColumnTable;
