<tr class="bg-info">
    <th colspan="13" class="bg-info">{{ $category }}</th>
</tr>

<tr class="bg-info">
    <th style="width: auto">Serial #</th>
    <th style="width: 100px">Category</th>
    <th style="width: 60px">Size</th>
    <th style="width: 50px">Color</th>
    <th style="width: 200px">Description</th>
    <th style="width: 150px">Checked Out To</th>
    <th style="width: 75px">Condition</th>
    <th style="width: 50px">Usable</th>
    <th style="width: 150px">Note</th>
    <th style="width: 200px">Source</th>
    <th style="width: 10px"></th>
    <th style="width: 10px"></th>
    <th style="width: 50px">Modified At</th>
</tr>

@foreach($items as $item)
<tr>
    <td>{{ $item['serial_number'] }}</td>
    <td>{{ $item['category'] }}</td>
    <td>{{ $item['size'] }}</td>
    <td>{{ $item['color'] }}</td>
    <td>{{ $item['description'] }}</td>
    <td>{{ $item['checked_out_to'] ? $item->checked_out_to->name : '' }}</td>
    <td>{{ $item['condition'] }}</td>
    <td>{{ $item['usable'] ? "Yes" : "No" }}</td>
    <td>{{ $item['note'] }}</td>
    <td>{{ $item['source'] }}</td>
    <td></td>
    <td></td>
    <td>{{ $item['updated_at'] }}</td>
</tr>
@endforeach
