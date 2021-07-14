@php 
    $checkedOutItemsExist = false;
@endphp

<tr>
    <th colspan="13" class="bg-info">{{ $category }}</th>
</tr>

<tr class="bg-info">
    <th>Id</th>
    <th>QTY</th>
    <th>Category</th>
    <th>Size</th>
    <th>Color</th>
    <th>Description</th>
    <th>Min Qty</th>
    <th>Restock To</th>
    <th>Note</th>
    <th>Source</th>
    <th></th>
    <th></th>
    <th>Modified At</th>
</tr>

@foreach($items as $item)
    @if(!$item->checked_out_to)
        <tr>
            <td>{{ $item['id'] }}</td>
            <td>{{ $item['quantity'] }}</td>
            <td>{{ $item['category'] }}</td>
            <td>{{ $item['size'] }}</td>
            <td>{{ $item['color'] }}</td>
            <td>{{ $item['description'] }}</td>
            <td>{{ $item['restock_trigger'] }}</td>
            <td>{{ $item['restock_to_quantity'] }}</td>
            <td>{{ $item['note'] }}</td>
            <td>{{ $item['source'] }}</td>
            <td></td>
            <td></td>
            <td>{{ $item['updated_at'] }}</td>
        </tr>
    @else
        @php 
        $checkedOutItemsExist = true;
        @endphp
    @endif
@endforeach

@if($checkedOutItemsExist)
    <tr>
        <th>Id</th>
        <th>QTY</th>
        <th>Category</th>
        <th>Size</th>
        <th>Color</th>
        <th>Description</th>
        <th>Checked Out To</th>
        <th>Condition</th>
        <th>Note</th>
        <th>Usable</th>
        <th></th>
        <th></th>
        <th>Modified At</th>
    </tr>

    @foreach($items as $item)
        @if($item->checked_out_to)
            <tr>
                <td>{{ $item['id'] }}</td>
                <td>{{ $item['quantity'] }}</td>
                <td>{{ $item['category'] }}</td>
                <td>{{ $item['size'] }}</td>
                <td>{{ $item['color'] }}</td>
                <td>{{ $item['description'] }}</td>
                <td>{{ $item->checked_out_to->name }}</td>
                <td>{{ $item['condition'] }}</td>
                <td>{{ $item['note'] }}</td>
                <td>{{ $item['usable'] }}</td>
                <td></td>
                <td></td>
                <td>{{ $item['updated_at'] }}</td>
            </tr>
        @endif
    @endforeach

@endif
