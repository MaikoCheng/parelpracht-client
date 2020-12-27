import {
  call, put, select, throttle,
} from 'redux-saga/effects';
import {
  Client, Dir4, Invoice, InvoiceParams,
} from '../../clients/server.generated';
import { takeEveryWithErrorHandling } from '../errorHandling';
import { errorSingle, setSingle } from '../single/actionCreators';
import {
  singleActionPattern, SingleActionType, SingleCreateAction, SingleFetchAction, SingleSaveAction,
} from '../single/actions';
import { SingleEntities } from '../single/single';
import { fetchTable, setTable } from '../tables/actionCreators';
import { tableActionPattern, TableActionType } from '../tables/actions';
import { getTable } from '../tables/selectors';
import { Tables } from '../tables/tables';
import { TableState } from '../tables/tableState';

function* fetchInvoices() {
  const client = new Client();

  const state: TableState<Invoice> = yield select(getTable, Tables.Invoices);
  const {
    sortColumn, sortDirection,
    take, skip,
    search,
  } = state;

  const { list, count } = yield call(
    [client, client.getAllInvoices], sortColumn, sortDirection as Dir4,
    skip, take, search,
  );
  yield put(setTable(Tables.Invoices, list, count));
}

function* fetchSingleInvoice(action: SingleFetchAction<SingleEntities.Invoice>) {
  const client = new Client();
  const invoice = yield call([client, client.getInvoice], action.id);
  yield put(setSingle(SingleEntities.Invoice, invoice));
}

function* saveSingleInvoice(
  action: SingleSaveAction<SingleEntities.Invoice, InvoiceParams>,
) {
  const client = new Client();
  yield call([client, client.updateInvoice], action.id, action.data);
  const invoice = yield call([client, client.getInvoice], action.id);
  yield put(setSingle(SingleEntities.Invoice, invoice));
}

function* errorSaveSingleInvoice() {
  yield put(errorSingle(SingleEntities.Invoice));
}

function* watchSaveSingleInvoice() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Invoice, SingleActionType.Save),
    saveSingleInvoice,
    { onErrorSaga: errorSaveSingleInvoice },
  );
}

function* createSingleInvoice(
  action: SingleCreateAction<SingleEntities.Invoice, InvoiceParams>,
) {
  const client = new Client();
  const invoice = yield call([client, client.createInvoice], action.data);
  yield put(setSingle(SingleEntities.Invoice, invoice));
  yield put(fetchTable(Tables.Invoices));
}

function* errorCreateSingleInvoice() {
  yield put(errorSingle(SingleEntities.Invoice));
}

function* watchCreateSingleInvoice() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Invoice, SingleActionType.Create),
    createSingleInvoice,
    { onErrorSaga: errorCreateSingleInvoice },
  );
}

export default [
  function* watchFetchInvoices() {
    yield throttle(
      500,
      tableActionPattern(Tables.Invoices, TableActionType.Fetch),
      fetchInvoices,
    );
  },
  function* watchFetchSingleInvoice() {
    yield takeEveryWithErrorHandling(
      singleActionPattern(SingleEntities.Invoice, SingleActionType.Fetch),
      fetchSingleInvoice,
    );
  },
  watchSaveSingleInvoice,
  watchCreateSingleInvoice,
];
