<form id="status-form-{{ $resource->identifier }}" action="{{ route('store_status_for_crew_resource', ['crewId' => $crew->id, 'identifier' => $resource->identifier]) }}"
      method="POST"
      class="form-horizontal helicopter-status-form"
>
    {{ csrf_field() }}
    <input type="hidden" name="statusable_resource_type" value="{{ $resource->resource_type }}" />
    <input type="hidden" name="statusable_resource_id" value="{{ $resource->id }}" />
    <input type="hidden" name="statusable_resource_name" value="{{ $resource->identifier}}" />


    <div class="col-xs-12">
        @include("status_forms._fields_for_location")
    </div>

    <div class="col-xs-12">
        <h2>Staffing</h2>
        @if(!is_null($resource->staffingCategory1()))
        <div class="form-group">
            <label for="staffing_value1" class="col-xs-4 col-sm-2 control-label control-label-with-helper">
                {{ $resource->staffingCategory1() }}
            </label>
            <a role="button" class="control-label-helper" tabindex="0" data-toggle="popover" title="{{ $resource->staffingCategory1() }}" data-trigger="focus" data-content="{{ $resource->staffingCategory1Explanation() }}">
                <span class="glyphicon glyphicon-question-sign"></span>
            </a>
            <div class="col-xs-2 col-md-1">
                <input type="text" name="staffing_category1" id="staffing_category1" class="hidden" value="{{ $resource->staffingCategory1() }}">
                <input type="text" name="staffing_value1" id="staffing_value1" class="form-control"  value="{{ $status->staffing_value1 }}">
            </div>
        </div>
        @endif
        @if(!is_null($resource->staffingCategory2()))
        <div class="form-group">
            <label for="staffing_value2" class="col-xs-4 col-sm-2 control-label control-label-with-helper">
                {{ $resource->staffingCategory2() }}
            </label>
            <a role="button" class="control-label-helper" tabindex="0" data-toggle="popover" title="{{ $resource->staffingCategory2() }}" data-trigger="focus" data-content="{{ $resource->staffingCategory2Explanation() }}">
                <span class="glyphicon glyphicon-question-sign"></span>
            </a>
            <div class="col-xs-12 col-sm-6 col-md-6">
                <input type="text" name="staffing_category2" id="staffing_category2" class="hidden" value="{{ $resource->staffingCategory2() }}">
                <input type="text" name="staffing_value2" id="staffing_value2" class="form-control" value="{{ $status->staffing_value2 }}">
            </div>
        </div>
        @endif
        @if(!is_null($resource->staffingCategory3()))
            <div class="form-group">
                <label for="staffing_value3" class="col-xs-4 col-sm-2 control-label control-label-with-helper">
                    {{ $resource->staffingCategory3() }}
                </label>
                <a role="button" class="control-label-helper" tabindex="0" data-toggle="popover" title="{{ $resource->staffingCategory3() }}" data-trigger="focus" data-content="{{ $resource->staffingCategory3Explanation() }}">
                    <span class="glyphicon glyphicon-question-sign"></span>
                </a>
                <div class="col-xs-12 col-sm-6 col-md-6">
                    <input type="text" name="staffing_category3" id="staffing_category3" class="hidden" value="{{ $resource->staffingCategory3() }}">
                    <input type="text" name="staffing_value3" id="staffing_value3" class="form-control" value="{{ $status->staffing_value3 }}">
                </div>
            </div>
        @endif
        <div class="form-group">
            <label for="manager_name" class="col-xs-4 col-sm-2 control-label control-label-with-helper">Spotter</label>
            <a role="button" class="control-label-helper" tabindex="0" data-toggle="popover" title="Spotter" data-trigger="focus" data-content="Enter the spotter's name">
                <span class="glyphicon glyphicon-question-sign"></span>
            </a>
            <div class="col-xs-12 col-sm-6 col-md-6">
                <input type="text" name="manager_name" id="manager_name" class="form-control" value="{{ $status->manager_name }}">
            </div>
        </div>
        <div class="form-group">
            <label for="manager_phone" class="col-xs-4 col-sm-2 control-label control-label-with-helper">Phone</label>
            <a role="button" class="control-label-helper" tabindex="0" data-toggle="popover" title="Spotter's Phone" data-trigger="focus" data-content="A phone number where the spotter/manager can be reached.">
                <span class="glyphicon glyphicon-question-sign"></span>
            </a>
            <div class="col-xs-12 col-sm-6 col-md-6">
                <input type="text" name="manager_phone" id="manager_phone" class="form-control" value="{{ $status->manager_phone }}" placeholder="XXX-XXX-XXXX">
            </div>
        </div>
    </div>

    <div class="col-xs-12">
        <h2>Current Assignment</h2>
        <div class="form-group">
            <label for="assigned_fire_name" class="col-xs-4 col-sm-2 control-label control-label-with-helper">Assignment</label>
            <a role="button" class="control-label-helper" tabindex="0" data-toggle="popover" title="Current Assignment" data-trigger="focus" data-content="Name of large fire, pre-position, local IA, etc. This field can also be left blank.">
                <span class="glyphicon glyphicon-question-sign"></span>
            </a>
            <div class="col-xs-12 col-sm-6 col-md-6">
                <select name="assigned_fire_name" id="assigned_fire_name" class="form-control">
                    <option value="">-- Select Assignment --</option>
                    <option value="Local IA" {{ $status->assigned_fire_name == 'Local IA' ? 'selected' : '' }}>Local IA</option>
                    <option value="Prepo" {{ $status->assigned_fire_name == 'Prepo' ? 'selected' : '' }}>Prepo</option>
                    <option value="Large Fire Support" {{ $status->assigned_fire_name == 'Large Fire Support' ? 'selected' : '' }}>Large Fire Support</option>
                    <option value="Project" {{ $status->assigned_fire_name == 'Project' ? 'selected' : '' }}>Project</option>
                    <option value="Other" {{ $status->assigned_fire_name == 'Other' ? 'selected' : '' }}>Other</option>
                </select>
            </div>
        </div>
        <!-- <div class="form-group">
            <label for="assigned_fire_number" class="col-xs-4 col-sm-2 control-label">Fire Number</label>
            <div class="col-sm-6">
                <input type="text" name="assigned_fire_number" id="assigned_fire_number" class="form-control" value="{{ $status->assigned_fire_number }}" placeholder="AA-BBB-123456">
            </div>
        </div>
        <div class="form-group">
            <label for="assigned_supervisor" class="col-xs-4 col-sm-2 control-label">Reporting To:</label>
            <div class="col-sm-6">
                <input type="text" name="assigned_supervisor" id="assigned_supervisor" class="form-control" value="{{ $status->assigned_supervisor }}">
            </div>
        </div>
        <div class="form-group">
            <label for="assigned_supervisor_phone" class="col-xs-4 col-sm-2 control-label">Phone</label>
            <div class="col-sm-6">
                <input type="text" name="assigned_supervisor_phone" id="assigned_supervisor_phone" class="form-control" value="{{ $status->assigned_supervisor_phone }}" placeholder="XXX-XXX-XXXX">
            </div>
        </div> -->
    </div>

    <div class="col-xs-12">
        <h2>Remarks</h2>
        <div class="form-group">
            <label class="col-xs-4 col-sm-2 control-label control-label-with-helper">Staffed Incidents</label>
            <a role="button" class="control-label-helper" tabindex="0" data-toggle="popover" title="Staffed Incidents" data-trigger="focus" data-content="i.e. MHF-355: Parker+3">
                <span class="glyphicon glyphicon-question-sign"></span>
            </a>
            <div class="col-xs-12 col-sm-6 col-md-6">
                <div class="staffed-incidents-rows">
                    <!-- Rows will be inserted here by JS -->
                </div>
                <button type="button" class="btn btn-success" style="margin-top:10px;">Add an incident</button>
                <!-- This is the field that will actually be process by the server. The staffed_incidents dynamic fields will be serialized to JSON and stored here upon form submit -->
                <input type="hidden" name="comments1" value="">
            </div>
            <script>
                (function() {
                    // Only set up the event handler once
                    // if (window.staffedIncidentsInitialized) {
                    //     return;
                    // }
                    // window.staffedIncidentsInitialized = true;
                    
                    // Parse existing server data if available (should be formatted as JSON string)
                    var initialIncidents = [];
                    @if(isset($status->comments1))
                        try {
                            initialIncidents = JSON.parse(@json($status->comments1));
                        }
                        catch (e) {
                            console.log('Couldn\'t JSON.parse initial data for Staffed Incidents: ', e);
                            initialIncidents = [];
                        }
                    @endif
                        
                    function createStaffedIncidentRow(index, data = {}) {
                        return `
                            <div class="staffed-incident-row" data-index="${index}" style="margin-bottom:8px; display: flex">
                                    <input style="margin-right: 10px; width: 100px;" type="text" name="staffed_incidents[${index}][personnel]" class="form-control" placeholder="Personnel" value="${data.personnel ? data.personnel.replace(/&/g, '&amp;').replace(/\"/g, '&quot;') : ''}">
                                    <input style="margin-right: 10px" type="text" name="staffed_incidents[${index}][incident_name]" class="form-control" placeholder="Incident Name/Number" value="${data.incident_name ? data.incident_name.replace(/&/g, '&amp;').replace(/\"/g, '&quot;') : ''}">
                                    <input style="margin-right: 10px; width: 150px;" type="text" name="staffed_incidents[${index}][demob]" class="form-control" placeholder="Est. Demob Date" value="${data.demob ? data.demob.replace(/&/g, '&amp;').replace(/\"/g, '&quot;') : ''}">
                                    <button type="button" class="btn btn-danger delete-staffed-incident-row">
                                        <span class="glyphicon glyphicon-trash"></span>
                                    </button>
                            </div>
                        `;
                    }

                    function renderStaffedIncidentRows(formInstance, incidents) {
                        const container = formInstance.querySelector('.staffed-incidents-rows');
                        // console.log('Rendering staffed incident rows:', incidents);
                        container.innerHTML = '';
                        incidents.forEach((row, idx) => {
                            container.innerHTML += createStaffedIncidentRow(idx, row);
                        });
                    }

                    // Initialize each form instance separately
                    document.addEventListener('DOMContentLoaded', function() {
                        // Find all instances of this helicopter status form on the page (there should only be one)
                        // console.log('status-form-{{ $resource->identifier }}');
                        // console.log(initialIncidents);
                        const formInstance = document.getElementById('status-form-{{ $resource->identifier }}');
                        if (!formInstance) {
                            console.warn('No form instance found for identifier {{ $resource->identifier }}');
                            return;
                        }
                            
                        // Always create a new array to avoid reference issues
                        var staffedIncidents = [];
                        
                        // If we have valid initial data, use it
                        if (Array.isArray(initialIncidents) && initialIncidents.length > 0) {
                            staffedIncidents = initialIncidents.map(incident => ({
                                personnel: incident.personnel || '',
                                incident_name: incident.incident_name || '',
                                demob: incident.demob || ''
                            }));
                        } else {
                            // Otherwise start with one empty row
                            staffedIncidents = [{ personnel: '', incident_name: '', demob: '' }];
                        }
                        
                        function getCurrentStaffedIncidentValues() {
                            const rows = formInstance.querySelectorAll('.staffed-incident-row');
                            if (!rows || rows.length === 0) {
                                return [];
                            }
                            return Array.from(rows).map(row => {
                                const personnel = row.querySelector('input[name*="[personnel]"]').value || '';
                                const incident_name = row.querySelector('input[name*="[incident_name]"]').value || '';
                                const demob = row.querySelector('input[name*="[demob]"]').value || '';
                                return { personnel, incident_name, demob };
                            });
                        }

                        function handleAddRow() {
                            if (formInstance.querySelectorAll('.staffed-incident-row').length > 0) {
                                staffedIncidents = getCurrentStaffedIncidentValues();
                                staffedIncidents.push({});
                            } else {
                                staffedIncidents = [{}];
                            }
                            renderStaffedIncidentRows(formInstance, staffedIncidents);
                        }

                        function handleDeleteRow(e) {
                            // Check if the click was on the button or the icon inside it
                            const deleteButton = e.target.classList.contains('delete-staffed-incident-row') ? 
                                e.target : 
                                e.target.closest('.delete-staffed-incident-row');
                            
                            if (deleteButton) {
                                staffedIncidents = getCurrentStaffedIncidentValues();
                                const row = deleteButton.closest('.staffed-incident-row');
                                const idx = parseInt(row.getAttribute('data-index'));
                                staffedIncidents.splice(idx, 1);
                                if(staffedIncidents.length === 0) staffedIncidents.push({});
                                renderStaffedIncidentRows(formInstance, staffedIncidents);
                            }
                        }

                        renderStaffedIncidentRows(formInstance, staffedIncidents);

                        // Add event listeners scoped to this form instance
                        const addButton = formInstance.querySelector('.btn-success');
                        addButton.addEventListener('click', handleAddRow);

                        const rowsContainer = formInstance.querySelector('.staffed-incidents-rows');
                        rowsContainer.addEventListener('click', handleDeleteRow);

                        // When the submit button is clicked, serialize the "staffed_incidents" dynamic fields to JSON and store in the hidden input field named "comments1"
                        // That form field will be stored in comments1 db column as text (JSON string)
                        formInstance.addEventListener('submit', function(e) {
                            staffedIncidents = getCurrentStaffedIncidentValues()
                                .filter(incident => incident.personnel || incident.incident_name || incident.demob);
                            formInstance.querySelector('input[name="comments1"]').value = JSON.stringify(staffedIncidents);
                        });
                    }); // Close the DOMContentLoaded
                
                })(); // Close the IIFE

            </script>
        </div>
        <div class="form-group">
            <label for="comments2" class="col-xs-4 col-sm-2 control-label control-label-with-helper">Additional Info</label>
            <a role="button" class="control-label-helper" tabindex="0" data-toggle="popover" title="Additional Info" data-trigger="focus" data-content="Pertinent information that affects helicopter or rappel operations">
                <span class="glyphicon glyphicon-question-sign"></span>
            </a>
            <div class="col-xs-12 col-sm-6 col-md-6">
                <textarea name="comments2" id="comments2" class="form-control" rows="4">{{ $status->comments2 }}</textarea>
            </div>
        </div>
    </div>

    <div class="col-xs-12">
        <div class="form-group">
            <div class="col-sm-3">
                <button type="submit" class="btn btn-default">Update</button>
            </div>
        </div>
    </div>

</form>
