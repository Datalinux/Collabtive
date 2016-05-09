<div class="headline">
    <a href="javascript:void(0);" id="milehead_toggle" class="win_block" onclick="toggleBlock('milehead');"></a>

    <h2><img src="./templates/{$settings.template}/theme/{$settings.theme}/images/symbols/miles.png" alt=""/>Late {#milestones#}</h2>
    <loader block="currentMilestones" loader="loader-calendar.gif"></loader>
</div>

<div class="block" id="lateMilestonesHead">
    <div class="nosmooth" >

        <table cellpadding="0" cellspacing="0" border="0">
            <thead>
            <tr>
                <th class="a"></th>
                <th class="b">{#milestone#}</th>
                <th class="c">{#due#}</th>
                <th class="days" style="text-align:right">{#daysleft#}&nbsp;&nbsp;</th>
                <th class="tools"></th>
            </tr>
            </thead>

            <tfoot>
            <tr>
                <td colspan="5"></td>
            </tr>
            </tfoot>
        </table>
    </div>
    <!--late Miles-->
    <div class="toggleblock" id="lateMilestones" v-cloak >
        {literal}
        <table class="miles" v-for="milestone in items" id="accordion_miles_late" cellpadding="0" cellspacing="0" border="0">
            <tbody class="miles alternateColors" id="miles_late_{{milestone.ID}}">
            <tr class="marker-late">
                <td class="a">
                    {/literal}
                    {if $userpermissions.milestones.close}
                    {literal}
                        <a class="butn_check" href="javascript:closeElement('miles_late_{{*milestone.ID}}','managemilestone.php?action=close&amp;mid={{milestone.ID}}&amp;id={{*milestone.project}}');" title="{/literal}{#close#}"></a>
                    {/if}
                </td>
                {literal}
                    <td class="b">
                        <div class="toggle-in">
                            <span class="acc-toggle"
                                  onclick="javascript:accord_miles_late.activate(document.querySelector('#lateMilestones_content{{$index}}'));">

                            </span>
                            <a href="managemilestone.php?action=showmilestone&amp;msid={{*milestone.ID}}&amp;id={{*milestone.project}}"
                               title="{{*milestone.name}}">{{*milestone.name | truncate '30' }}</a>
                        </div>
                    </td>
                    <td class="c">{{milestone.fend}}</td>
                    <td class="days" style="text-align:right">-{{*milestone.dayslate}}&nbsp;&nbsp;</td>
                {/literal}
                <td class="tools">
                    {if $userpermissions.milestones.edit}
                    {literal}
                        <a class="tool_edit" href="managemilestone.php?action=editform&amp;mid={{*milestone.ID}}&amp;id={{*milestone.project}}"
                        title="{/literal}{#edit#}"></a>
                    {/if}
                    {if $userpermissions.milestones.del}
                    {literal}
                        <a class="tool_del"
                           href="javascript:confirmfunction('{#confirmdel#}','deleteElement(\'miles_late_{$latemilestones[latestone].ID}\',\'managemilestone.php?action=del&amp;mid={$latemilestones[latestone].ID}&amp;id={$project.ID}\')');"
                           title="{#delete#}"></a>
                    {/literal}
                    {/if}
                </td>
                {literal}
            </tr>
            <tr class="acc">
                <td colspan="5">
                    <div class="accordion_content" data-slide="{{$index}}" id="lateMilestones_content{{$index}}">
                        <div class="acc-in">
                            <div class="message-in">
                                {{*milestone.desc}}
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
            </tbody>

        </table>

    </div>
    {/literal}
    <!--toggleblock End-->
</div><!-- block end -->

<div class = "content-spacer"></div>